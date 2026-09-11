import type { CourseModule, CourseOutcome, Material } from '@/lib/types';

export const course = {
  code: 'DATA301',
  title: 'Machine Learning',
  program: 'B.Tech. (Hons.) Data Science',
  school: 'School of Engineering & Technology',
  semester: 'V',
  credits: 4,
  ltp: '2:0:4',
  durationWeeks: 15,
  lectureHours: 30,
  practiceHours: 60,
  prerequisite: 'Optimization Techniques for Data Science (MATH301)',
  instructor: 'Dr. Shabbeer Basha',
  description:
    'A theory-to-practice course covering regression, classification, clustering, dimensionality reduction, model evaluation, regularization, and perceptron-based learning with Python.',
};

export const outcomes: CourseOutcome[] = [
  {
    code: 'CO1',
    description:
      'Explain various types of machine learning algorithms and the role of data preprocessing in machine learning.',
    level: 'L3',
  },
  {
    code: 'CO2',
    description:
      "Evaluate regression and classification models' performance on real-time datasets.",
    level: 'L3',
  },
  {
    code: 'CO3',
    description:
      'Apply unsupervised learning algorithms for pattern discovery and structural analysis in datasets.',
    level: 'L3',
  },
  {
    code: 'CO4',
    description: 'Implement machine learning models to solve a given problem.',
    level: 'L4',
  },
];

export const modules: CourseModule[] = [
  {
    number: 1,
    slug: 'introduction-and-data',
    title: 'Introduction to Machine Learning',
    shortTitle: 'Foundations & Data',
    level: 'Foundation',
    lectureSessions: 4,
    practiceSessions: 4,
    lectureHours: 4,
    practiceHours: 8,
    takeaway: 'Understand machine learning and its foundations.',
    outcomes: ['CO1'],
    description:
      'Build a precise mental model of AI and ML, examine learning paradigms and applications, and prepare data through missing-value handling, scaling, outlier treatment, and categorical encoding.',
    topics: [
      'What is Machine Learning?',
      'Learning paradigms',
      'NLP and computer vision applications',
      'Types of data',
      'Missing data',
      'Normalization and standardization',
      'Outliers and categorical encoding',
      'Training, validation, and test terminology',
    ],
    lectures: [
      {
        number: 1,
        title:
          'Introduction to Machine Learning, learning paradigms, and applications in NLP and computer vision',
        practice: {
          code: 'P1-P2',
          title: 'Python ecosystem for machine learning: Python, SciPy, and Scikit-learn',
        },
      },
      {
        number: 2,
        title: 'Data preparation: data types, missing data, class imbalance, and resampling',
      },
      {
        number: 3,
        title: 'Data scaling: standardization and normalization',
        practice: {
          code: 'P3-P4',
          title: 'Demonstrate data-preprocessing techniques on a dataset',
        },
      },
      {
        number: 4,
        title:
          'Outliers, categorical encoding, and terminology: features, samples, and dataset splits',
      },
    ],
    accent: 'cobalt',
  },
  {
    number: 2,
    slug: 'supervised-learning',
    title: 'Supervised Learning Techniques',
    shortTitle: 'Supervised Learning',
    level: 'Intermediate',
    lectureSessions: 12,
    practiceSessions: 12,
    lectureHours: 12,
    practiceHours: 24,
    takeaway: 'Understand and implement supervised machine-learning techniques.',
    outcomes: ['CO2', 'CO4'],
    description:
      'Move from regression fundamentals to classification with KNN, decision trees, random forests, ensembles, SVMs, and appropriate evaluation metrics.',
    topics: [
      'Regression and gradient descent',
      'Multiple linear regression',
      'Regression metrics',
      'Classification workflow',
      'K-nearest neighbours',
      'Decision trees',
      'Random forests',
      'Bagging and boosting',
      'Support vector machines',
      'Classification metrics',
    ],
    lectures: [
      {
        number: 5,
        title: 'Supervised learning and introduction to regression',
        practice: {
          code: 'P5-P6',
          title: 'Build a linear regression model for dependent and independent variables',
        },
      },
      { number: 6, title: 'Simple linear regression and gradient descent' },
      {
        number: 7,
        title: 'Multiple linear regression and regression metrics',
        practice: { code: 'P7-P8', title: 'Implement KNN classification' },
      },
      { number: 8, title: 'Classification models and learning steps' },
      {
        number: 9,
        title: 'K-nearest neighbour classification',
        practice: { code: 'P9-P10', title: 'Implement a decision tree classifier' },
      },
      { number: 10, title: 'Decision tree classification' },
      {
        number: 11,
        title: 'Decision tree classification continued',
        practice: { code: 'P11-P12', title: 'Implement a random forest classifier' },
      },
      { number: 12, title: 'Random forest classification' },
      {
        number: 13,
        title: 'Ensemble learning: bagging and boosting',
        practice: { code: 'P13-P14', title: 'Implement and analyse classifiers' },
      },
      { number: 14, title: 'Support vector machine classification' },
      {
        number: 15,
        title: 'Support vector machine classification continued',
        practice: { code: 'P15-P16', title: 'Implement and analyse classifiers' },
      },
      { number: 16, title: 'Metrics for evaluating classification models' },
    ],
    accent: 'violet',
  },
  {
    number: 3,
    slug: 'unsupervised-learning',
    title: 'Unsupervised Learning',
    shortTitle: 'Unsupervised Learning',
    level: 'Intermediate',
    lectureSessions: 8,
    practiceSessions: 8,
    lectureHours: 8,
    practiceHours: 16,
    takeaway: 'Understand unsupervised machine-learning models.',
    outcomes: ['CO3', 'CO4'],
    description:
      'Discover structure without labels through clustering, density-based methods, hierarchical techniques, and principal component analysis.',
    topics: [
      'Supervised vs. unsupervised learning',
      'Clustering applications and metrics',
      'K-means and K-medoids',
      'Hierarchical clustering',
      'DBSCAN',
      'Dimensionality reduction',
      'Principal component analysis',
    ],
    lectures: [
      {
        number: 17,
        title: 'Unsupervised learning, supervised comparison, and applications',
        practice: { code: 'P17-P18', title: 'Implement K-means clustering' },
      },
      { number: 18, title: 'Clustering applications, types, and metrics' },
      {
        number: 19,
        title: 'Partitioning methods: K-means and K-medoids',
        practice: { code: 'P19-P20', title: 'Implement K-means clustering' },
      },
      { number: 20, title: 'Hierarchical clustering' },
      {
        number: 21,
        title: 'Density-based methods: DBSCAN',
        practice: { code: 'P21-P22', title: 'Implement PCA dimensionality reduction' },
      },
      { number: 22, title: 'Dimensionality-reduction techniques' },
      {
        number: 23,
        title: 'Principal component analysis',
        practice: { code: 'P23-P24', title: 'Implement PCA dimensionality reduction' },
      },
      { number: 24, title: 'Module review' },
    ],
    accent: 'teal',
  },
  {
    number: 4,
    slug: 'model-building-and-perceptron',
    title: 'Model Building and Introduction to Perceptron',
    shortTitle: 'Model Building',
    level: 'Advanced',
    lectureSessions: 6,
    practiceSessions: 6,
    lectureHours: 6,
    practiceHours: 12,
    takeaway: 'Build perceptron and logistic-regression models to solve classification problems.',
    outcomes: ['CO2', 'CO3', 'CO4'],
    description:
      'Bring the course together through regularization, cross-validation, bias-variance reasoning, model selection, perceptrons, and logistic regression.',
    topics: [
      'Lasso and ridge regularization',
      'Cross-validation',
      'Overfitting and underfitting',
      'Bias and variance',
      'Hyperparameters',
      'Model evaluation and selection',
      'Biological neuron and perceptron',
      'Perceptron learning algorithm',
      'Logistic regression and sigmoid activation',
    ],
    lectures: [
      {
        number: 25,
        title: 'Model regularization: lasso and ridge',
        practice: { code: 'P25-P26', title: 'Evaluate models using appropriate metrics' },
      },
      {
        number: 26,
        title: 'Cross-validation, overfitting, underfitting, bias, variance, and hyperparameters',
      },
      {
        number: 27,
        title: 'Model evaluation and selection',
        practice: {
          code: 'P27-P28',
          title: 'Implement perceptron and logistic regression for classification',
        },
      },
      { number: 28, title: 'Biological neuron and the perceptron learning algorithm' },
      {
        number: 29,
        title: 'Perceptron learning algorithm continued',
        practice: { code: 'P29-P30', title: 'Course project reviews' },
      },
      { number: 30, title: 'Logistic regression and the sigmoid activation function' },
    ],
    accent: 'amber',
  },
];

export const materials: Material[] = [
  {
    id: 'public-course-guide',
    title: 'DATA301 Platform Guide',
    description:
      'A short guide to the course overview, learning roadmap, laboratories, and protected material library.',
    kind: 'reference',
    href: '/resources/course-guide.md',
    fileName: 'course-guide.md',
    format: 'Markdown',
    sizeLabel: '< 1 KB',
    status: 'published',
    publishedAt: '2026-09-09',
    version: 1,
  },
  {
    id: 'public-lab-guide',
    title: 'Interactive Laboratory Guide',
    description:
      'How to move from browser-based visual experimentation to Python and Jupyter practice.',
    kind: 'lab',
    href: '/resources/lab-guide.md',
    fileName: 'lab-guide.md',
    format: 'Markdown',
    sizeLabel: '< 1 KB',
    status: 'published',
    publishedAt: '2026-09-09',
    version: 1,
  },
];

export const bibliography = {
  textbooks: [
    'Tom M. Mitchell, Machine Learning, McGraw-Hill, 1997.',
    'Ethem Alpaydin, Introduction to Machine Learning, MIT Press, 2020.',
  ],
  references: [
    'Kevin P. Murphy, Machine Learning: A Probabilistic Perspective, MIT Press, 2012.',
    'Christopher M. Bishop, Pattern Recognition and Machine Learning, Springer, 2007.',
    'Richard O. Duda, Peter E. Hart, and David G. Stork, Pattern Classification, Wiley, 2001.',
    'Aurélien Géron, Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow, O’Reilly Media.',
    'Sebastian Raschka and Vahid Mirjalili, Python Machine Learning, Packt Publishing, 2019.',
    'James, Witten, Hastie, Tibshirani, and Taylor, An Introduction to Statistical Learning: with Applications in Python.',
  ],
};

export const assessmentReviewFlag = {
  title: 'Assessment-weight verification required',
  severity: 'high' as const,
  detail:
    'The supplied course overview and detailed course plan contain differing weight distributions. Keep assessment percentages unpublished until the instructor confirms the authoritative version.',
};

export const findModule = (slug: string) => modules.find((module) => module.slug === slug);
