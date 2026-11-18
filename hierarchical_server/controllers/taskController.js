const mongoose = require("mongoose");
const Task = require("../models/Task");

function buildTree(tasks) {
  const byId = new Map();
  const roots = [];

  for (const item of tasks) {
    byId.set(item._id.toString(), {
      id: item._id.toString(),
      title: item.title,
      parentId: item.parentId ? item.parentId.toString() : null,
      completed: item.completed,
      children: [],
    });
  }

  for (const node of byId.values()) {
    if (node.parentId && byId.has(node.parentId)) {
      byId.get(node.parentId).children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

async function getFullTree() {
  const tasks = await Task.find().sort({ createdAt: 1 }).lean();
  return buildTree(tasks);
}

async function getDescendantIds(rootId) {
  const allTasks = await Task.find({}, { _id: 1, parentId: 1 }).lean();
  const childrenMap = new Map();

  for (const t of allTasks) {
    if (!t.parentId) continue;
    const pid = t.parentId.toString();
    if (!childrenMap.has(pid)) {
      childrenMap.set(pid, []);
    }
    childrenMap.get(pid).push(t._id);
  }

  const descendants = [];
  const queue = [rootId.toString()];

  while (queue.length > 0) {
    const curr = queue.shift();
    const kids = childrenMap.get(curr) || [];
    for (const kidId of kids) {
      descendants.push(kidId);
      queue.push(kidId.toString());
    }
  }

  return descendants;
}

// Walk upward from parentId and update each ancestor based on its direct children
async function syncAncestors(startParentId) {
  let currentParentId = startParentId;

  while (currentParentId) {
    const parent = await Task.findById(currentParentId);
    if (!parent) break;

    const children = await Task.find({ parentId: parent._id }, { completed: 1 }).lean();
    if (children.length === 0) break;

    const allChecked = children.every((child) => child.completed);

    if (parent.completed !== allChecked) {
      parent.completed = allChecked;
      await parent.save();
    }

    currentParentId = parent.parentId;
  }
}

const getTasks = async (req, res) => {
  try {
    const tasks = await getFullTree();
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load tasks" });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, parentId = null } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    let validParentId = null;
    if (parentId) {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return res.status(400).json({ message: "Invalid parentId" });
      }
      const parentExists = await Task.exists({ _id: parentId });
      if (!parentExists) {
        return res.status(404).json({ message: "Parent task not found" });
      }
      validParentId = parentId;
    }

    const newTask = await Task.create({
      title: title.trim(),
      parentId: validParentId,
      completed: false,
    });

    if (validParentId) {
      await syncAncestors(validParentId);
    }

    const tasks = await getFullTree();
    res.status(201).json({
      task: {
        id: newTask._id.toString(),
        title: newTask.title,
        parentId: newTask.parentId ? newTask.parentId.toString() : null,
        completed: newTask.completed,
        children: [],
      },
      tasks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create task" });
  }
};

const toggleTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const nextState = !task.completed;
    const descendantIds = await getDescendantIds(task._id);

    await Task.updateMany(
      { _id: { $in: [task._id, ...descendantIds] } },
      { $set: { completed: nextState } }
    );

    if (task.parentId) {
      await syncAncestors(task.parentId);
    }

    const tasks = await getFullTree();
    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const parentId = task.parentId;
    const descendantIds = await getDescendantIds(task._id);

    await Task.deleteMany({ _id: { $in: [task._id, ...descendantIds] } });

    if (parentId) {
      await syncAncestors(parentId);
    }

    const tasks = await getFullTree();
    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete task" });
  }
};

module.exports = {
  getTasks,
  createTask,
  toggleTask,
  deleteTask,
};

