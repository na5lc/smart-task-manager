const predictPriority = (title, dueDate, category) => {
  let score = 0;

  // Check urgent keywords in title
  const urgentKeywords = ['urgent', 'asap', 'critical', 'important', 'deadline', 'emergency', 'immediately'];
  const lowKeywords = ['someday', 'maybe', 'optional', 'whenever', 'low'];
  const titleLower = title.toLowerCase();

  urgentKeywords.forEach(word => {
    if (titleLower.includes(word)) score += 3;
  });

  lowKeywords.forEach(word => {
    if (titleLower.includes(word)) score -= 2;
  });

  // Check days until due date
  if (dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (daysUntilDue <= 0) score += 5;
    else if (daysUntilDue <= 1) score += 4;
    else if (daysUntilDue <= 3) score += 3;
    else if (daysUntilDue <= 7) score += 1;
    else if (daysUntilDue > 14) score -= 1;
  }

  // Check category weight
  const highPriorityCategories = ['exam', 'assignment', 'project', 'work', 'job'];
  const lowPriorityCategories = ['personal', 'hobby', 'fun', 'entertainment'];

  if (category) {
    const categoryLower = category.toLowerCase();
    highPriorityCategories.forEach(cat => {
      if (categoryLower.includes(cat)) score += 2;
    });
    lowPriorityCategories.forEach(cat => {
      if (categoryLower.includes(cat)) score -= 1;
    });
  }

  // Return priority based on score
  if (score >= 4) return 'High';
  if (score >= 1) return 'Medium';
  return 'Low';
};

const suggestDeadline = (category) => {
  const today = new Date();
  const suggestions = {
    'exam': 3,
    'assignment': 5,
    'project': 7,
    'work': 2,
    'personal': 10,
    'hobby': 14,
    'general': 7
  };

  const categoryLower = category ? category.toLowerCase() : 'general';
  let daysToAdd = 7;

  Object.keys(suggestions).forEach(key => {
    if (categoryLower.includes(key)) {
      daysToAdd = suggestions[key];
    }
  });

  const suggested = new Date(today);
  suggested.setDate(today.getDate() + daysToAdd);
  return suggested;
};

module.exports = { predictPriority, suggestDeadline };