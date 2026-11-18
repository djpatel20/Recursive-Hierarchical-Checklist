Build a full-stack nested checklist application using React, TypeScript, and a database of your choice (e.g., PostgreSQL, MongoDB, SQLite, Firebase, or Supabase).
The application should allow users to create infinitely nested to-do lists where checking or unchecking an item cascades state changes both up and down the hierarchy, persisting all changes to the database.

Functional Requirements

1. Tree Structure & Creation
   Users can add top-level (root) list items.
   Users can add child items under any existing item, supporting arbitrary nesting depth (children can have their own children, and so on).
   Each item must render a checkbox at the start of the row, followed by its text label and an action to add a sub-item.
2. Cascading Checkbox Behavior
   Top-Down Cascade (Parent Descendants):
   Clicking an unchecked parent checkbox checks the parent and recursively checks all of its descendants.
   Clicking a checked parent checkbox unchecks the parent and recursively unchecks all of its descendants.

Bottom-Up Cascade (Child Ancestors):
When all direct children of a parent item become checked, the parent item must automatically become checked (which may continue cascading up to higher ancestors).
When any child of a checked parent becomes unchecked, the parent (and all ancestors above it) must automatically become unchecked. 3. Visual Feedback
Any checked item must display a strikethrough style on its text.
Visual indentation should clearly reflect the nesting depth of each item. 4. Persistence
All list items, their parent-child relationships, and their checked states must be persisted in the database so that the full tree state is restored on page reload.
Edge Cases to Consider
Adding a new child to an already-checked parent: Adding an unchecked child to a checked parent should automatically uncheck the parent (and its ancestors) since not all children are checked anymore.
Deeply nested updates: Checking the deepest leaf node in a 4-level branch where all siblings are already checked should bubble up and check all 3 ancestor levels in a single interaction.
Empty parent state: A leaf node (item with no children) can be toggled independently without affecting siblings, only bubbling up to its parent.
