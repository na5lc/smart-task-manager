const Task = require('../models/Task');

const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all tasks for user
    const allTasks = await Task.find({ userId });
    const completedTasks = allTasks.filter(t => t.status === 'completed');
    const pendingTasks = allTasks.filter(t => t.status === 'pending');
    const inProgressTasks = allTasks.filter(t => t.status === 'in-progress');

    // Overdue tasks
    const now = new Date();
    const overdueTasks = allTasks.filter(t =>
      t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed'
    );

    // Completion rate
    const completionRate = allTasks.length > 0
      ? Math.round((completedTasks.length / allTasks.length) * 100)
      : 0;

    // Average completion time (in hours)
    const completionTimes = completedTasks
      .filter(t => t.completedAt && t.createdAt)
      .map(t => (new Date(t.completedAt) - new Date(t.createdAt)) / (1000 * 60 * 60));

    const avgCompletionTime = completionTimes.length > 0
      ? Math.round(completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length)
      : 0;

    // Most productive hour
    const hourCounts = Array(24).fill(0);
    completedTasks.forEach(t => {
      if (t.completedAt) {
        const hour = new Date(t.completedAt).getHours();
        hourCounts[hour]++;
      }
    });
    const mostProductiveHour = hourCounts.indexOf(Math.max(...hourCounts));

    // Tasks by priority
    const tasksByPriority = {
      High: allTasks.filter(t => t.priority === 'High').length,
      Medium: allTasks.filter(t => t.priority === 'Medium').length,
      Low: allTasks.filter(t => t.priority === 'Low').length
    };

    // Tasks by category
    const categoryMap = {};
    allTasks.forEach(t => {
      const cat = t.category || 'General';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    // Tasks completed this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const completedThisWeek = completedTasks.filter(t =>
      t.completedAt && new Date(t.completedAt) > oneWeekAgo
    ).length;

    // Daily completed tasks (last 7 days)
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = completedTasks.filter(t => {
        if (!t.completedAt) return false;
        return new Date(t.completedAt).toISOString().split('T')[0] === dateStr;
      }).length;
      dailyStats.push({ date: dateStr, completed: count });
    }

    // Productivity insight message
    let productivityInsight = '';
    if (mostProductiveHour >= 5 && mostProductiveHour < 12) {
      productivityInsight = 'You are most productive in the morning!';
    } else if (mostProductiveHour >= 12 && mostProductiveHour < 17) {
      productivityInsight = 'You are most productive in the afternoon!';
    } else if (mostProductiveHour >= 17 && mostProductiveHour < 21) {
      productivityInsight = 'You are most productive in the evening!';
    } else {
      productivityInsight = 'You are most productive at night!';
    }

    res.json({
      overview: {
        total: allTasks.length,
        completed: completedTasks.length,
        pending: pendingTasks.length,
        inProgress: inProgressTasks.length,
        overdue: overdueTasks.length,
        completionRate,
        completedThisWeek,
        avgCompletionTime
      },
      tasksByPriority,
      tasksByCategory: categoryMap,
      dailyStats,
      productivity: {
        mostProductiveHour,
        insight: productivityInsight
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAnalytics };