const Task = require('../models/Task');
const { predictPriority, suggestDeadline } = require('../utils/priorityPredictor');

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const { status, priority, category, search } = req.query;
    let filter = { userId: req.user._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create task
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, category, tags } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // AI priority prediction
    const predictedPriority = predictPriority(title, dueDate, category);

    // Suggest deadline if not provided
    const suggestedDeadline = !dueDate ? suggestDeadline(category) : null;

    const task = await Task.create({
      title,
      description,
      priority: priority || predictedPriority,
      predictedPriority,
      dueDate: dueDate || suggestedDeadline,
      category: category || 'General',
      tags: tags || [],
      userId: req.user._id
    });

    res.status(201).json({
      message: 'Task created successfully',
      task,
      aiSuggestion: {
        predictedPriority,
        suggestedDeadline
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If marking as completed, set completedAt
    if (req.body.status === 'completed' && task.status !== 'completed') {
      req.body.completedAt = new Date();
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: 'Task updated', task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single task
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getTask };