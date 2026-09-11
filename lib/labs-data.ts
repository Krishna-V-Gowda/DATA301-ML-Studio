export type LabAccent = 'cobalt' | 'violet' | 'teal' | 'amber';

export type LabDefinition = {
  id: string;
  href: `/labs/${string}`;
  index: string;
  title: string;
  description: string;
  tags: string[];
  accent: LabAccent;
  keywords: string[];
};

export const labs: LabDefinition[] = [
  {
    id: 'linear-regression',
    href: '/labs/linear-regression',
    index: '01',
    title: 'Linear Regression Studio',
    description: 'Fit a line, expose residuals, tune parameters, and connect geometry to mean squared error.',
    tags: ['Regression', 'Residuals', 'MSE'],
    accent: 'cobalt',
    keywords: ['least squares', 'slope', 'intercept', 'prediction', 'regression line'],
  },
  {
    id: 'knn',
    href: '/labs/knn',
    index: '02',
    title: 'KNN Neighbourhood Lab',
    description: 'Move the query, change K, inspect nearest points, and see the decision update.',
    tags: ['Classification', 'Distance', 'Bias–variance'],
    accent: 'violet',
    keywords: ['nearest neighbour', 'K selection', 'local vote', 'distance', 'classification'],
  },
  {
    id: 'kmeans',
    href: '/labs/kmeans',
    index: '03',
    title: 'K-Means Iteration Lab',
    description: 'Step through assignment, centroid movement, inertia, and convergence.',
    tags: ['Clustering', 'Centroids', 'Inertia'],
    accent: 'teal',
    keywords: ['unsupervised', 'cluster assignment', 'centroid update', 'convergence'],
  },
  {
    id: 'confusion-matrix',
    href: '/labs/confusion-matrix',
    index: '04',
    title: 'Confusion Matrix Explorer',
    description: 'Manipulate four outcomes and understand accuracy, precision, recall, specificity, and F1.',
    tags: ['Evaluation', 'Thresholds', 'Metrics'],
    accent: 'amber',
    keywords: ['true positive', 'true negative', 'false positive', 'false negative', 'classification metrics'],
  },
  {
    id: 'logistic-regression',
    href: '/labs/logistic-regression',
    index: '05',
    title: 'Logistic Regression Lab',
    description: 'Shape a sigmoid classifier and see how the decision threshold changes precision and recall.',
    tags: ['Classification', 'Sigmoid', 'Threshold'],
    accent: 'violet',
    keywords: ['probability', 'decision boundary', 'binary classification', 'log odds'],
  },
  {
    id: 'gradient-descent',
    href: '/labs/gradient-descent',
    index: '06',
    title: 'Gradient Descent Lab',
    description: 'Change the learning rate and watch optimization converge, oscillate, or diverge.',
    tags: ['Optimization', 'Loss', 'Learning rate'],
    accent: 'teal',
    keywords: ['gradient', 'iteration', 'convergence', 'divergence', 'parameter update'],
  },
  {
    id: 'pca',
    href: '/labs/pca',
    index: '07',
    title: 'PCA Projection Studio',
    description: 'Compare candidate projections with computed PC1 and see when standardization changes the result.',
    tags: ['PCA', 'Variance', 'Projection'],
    accent: 'cobalt',
    keywords: ['principal component', 'dimensionality reduction', 'explained variance', 'standardization'],
  },
  {
    id: 'overfitting',
    href: '/labs/overfitting',
    index: '08',
    title: 'Overfitting & Generalization',
    description: 'Increase model complexity and compare training error with unseen-data error.',
    tags: ['Bias–variance', 'Generalization', 'Complexity'],
    accent: 'amber',
    keywords: ['underfitting', 'validation error', 'polynomial regression', 'model complexity'],
  },
  {
    id: 'decision-tree',
    href: '/labs/decision-tree',
    index: '09',
    title: 'Decision Tree Lab',
    description: 'Expose recursive Gini splits, decision regions, depth, and the onset of overfitting.',
    tags: ['Trees', 'Gini', 'Recursive splits'],
    accent: 'amber',
    keywords: ['impurity', 'leaf', 'split threshold', 'classification tree', 'tree depth'],
  },
  {
    id: 'svm',
    href: '/labs/svm',
    index: '10',
    title: 'Support Vector Machine Lab',
    description: 'Reveal the margin, support vectors, hinge loss, and the effect of the C penalty.',
    tags: ['SVM', 'Margin', 'Support vectors'],
    accent: 'violet',
    keywords: ['hyperplane', 'soft margin', 'hinge loss', 'C parameter', 'linear separator'],
  },
  {
    id: 'roc-pr',
    href: '/labs/roc-pr',
    index: '11',
    title: 'ROC & Precision–Recall Lab',
    description: 'Move one threshold and track the linked operating point across both curves.',
    tags: ['ROC', 'Precision–Recall', 'AUC'],
    accent: 'teal',
    keywords: ['true positive rate', 'false positive rate', 'class imbalance', 'operating point'],
  },
  {
    id: 'ensemble',
    href: '/labs/ensemble',
    index: '12',
    title: 'Ensemble Learning Lab',
    description: 'Compare one tree with bootstrap aggregation and inspect majority-vote confidence.',
    tags: ['Bagging', 'Voting', 'Variance'],
    accent: 'cobalt',
    keywords: ['bootstrap', 'random forest', 'majority vote', 'weak learner', 'variance reduction'],
  },
];
