export type ProjectBrief = {
  slug: string;
  number: string;
  level: string;
  title: string;
  objective: string;
  question: string;
  concepts: string;
  output: string;
  investigation: string[];
  connectedLabs: { title: string; href: string }[];
};

export const projectBriefs: ProjectBrief[] = [
  {
    slug: 'house-price-regression-audit',
    number: '01',
    level: 'Foundation',
    title: 'House-price regression audit',
    objective: 'Build and evaluate a regression pipeline while diagnosing preprocessing choices and residual error.',
    question: 'How much of a regression result comes from the model, and how much comes from the data preparation around it?',
    concepts: 'Preprocessing · Linear regression · MSE / R²',
    output: 'Notebook · report · reproducible pipeline',
    investigation: [
      'Define the prediction target, inputs, dataset scope, and evaluation plan.',
      'Compare a defensible preprocessing path with a deliberately simpler baseline.',
      'Inspect residual behaviour and use MSE / R² to explain what the model is and is not capturing.',
    ],
    connectedLabs: [
      { title: 'Linear Regression Studio', href: '/labs/linear-regression' },
      { title: 'Overfitting & Generalization', href: '/labs/overfitting' },
    ],
  },
  {
    slug: 'customer-segmentation-study',
    number: '02',
    level: 'Intermediate',
    title: 'Customer-segmentation study',
    objective: 'Explore a dataset, cluster samples, evaluate structure, and communicate what the groups do and do not mean.',
    question: 'What structure appears when labels are removed, and how confidently can those groups be described?',
    concepts: 'Scaling · K-means · PCA',
    output: 'Notebook · visual analysis · limitations memo',
    investigation: [
      'Define a feature set appropriate for clustering and state the scaling choice explicitly.',
      'Run K-means and inspect centroid movement, assignment structure, and within-cluster inertia.',
      'Use PCA as an explanatory view rather than treating a two-dimensional picture as proof of cluster validity.',
    ],
    connectedLabs: [
      { title: 'K-Means Iteration Lab', href: '/labs/kmeans' },
      { title: 'PCA Studio', href: '/labs/pca' },
    ],
  },
  {
    slug: 'imbalanced-classification-investigation',
    number: '03',
    level: 'Intermediate',
    title: 'Imbalanced classification investigation',
    objective: 'Compare classifiers and thresholds where accuracy alone is misleading.',
    question: 'How does the decision change when the cost of a false positive and a false negative is not the same?',
    concepts: 'Classification · confusion matrix · precision / recall',
    output: 'Model comparison · metric rationale · error analysis',
    investigation: [
      'Define the positive class and explain why class balance changes the interpretation of accuracy.',
      'Compare confusion matrices at controlled thresholds and track precision, recall, specificity, and F1.',
      'Write the conclusion around the metric trade-off rather than a single headline score.',
    ],
    connectedLabs: [
      { title: 'Confusion Matrix Explorer', href: '/labs/confusion-matrix' },
      { title: 'ROC & Precision–Recall Lab', href: '/labs/roc-pr' },
      { title: 'Logistic Regression Lab', href: '/labs/logistic-regression' },
    ],
  },
  {
    slug: 'small-data-transfer-compression-study',
    number: '04',
    level: 'Advanced',
    title: 'Small-data transfer and compression study',
    objective: 'Design an experiment around limited data or reduced model complexity without fabricating results.',
    question: 'What can be learned responsibly when data or model capacity is deliberately constrained?',
    concepts: 'Validation · model selection · research design',
    output: 'Proposal · experiment plan · code · presentation',
    investigation: [
      'State the experimental constraint before choosing a model or reporting a result.',
      'Design a comparison with a clear baseline, controlled variables, and an explicit validation strategy.',
      'Separate observed evidence from hypotheses about transfer, compression, or generalization.',
    ],
    connectedLabs: [
      { title: 'Overfitting & Generalization', href: '/labs/overfitting' },
      { title: 'Ensemble Lab', href: '/labs/ensemble' },
      { title: 'Support Vector Machine Lab', href: '/labs/svm' },
    ],
  },
];

export const projectBriefBySlug = new Map(projectBriefs.map((project) => [project.slug, project]));
