import type { Topic } from '@/lib/types';

export const topics: Topic[] = [
  {
    slug: 'what-is-machine-learning',
    title: 'What is Machine Learning?',
    eyebrow: 'Module 1 · Foundations',
    oneLine: 'Machine learning builds models that learn patterns from data and use those patterns on unseen cases.',
    summary:
      'Begin with the relationship between artificial intelligence and machine learning, then trace the core loop: collect examples, train a model, evaluate it on unseen data, and improve the system based on evidence.',
    difficulty: 'Foundation',
    moduleSlug: 'introduction-and-data',
    estimatedMinutes: 12,
    prerequisites: [],
    learnNext: ['learning-paradigms', 'regression-vs-classification'],
    related: ['data-preprocessing', 'training-validation-test'],
    tags: ['AI', 'ML', 'model', 'data', 'prediction'],
    sections: [
      {
        id: 'intuition',
        title: 'Intuition first',
        body: [
          'Traditional programs are given explicit rules. A machine-learning system is given examples and an objective, then estimates a useful mapping from inputs to outputs.',
          'The resulting model is not a database of memorized answers. It is a parameterized function whose quality is judged by how well it behaves on data it did not see during training.',
        ],
        callout: 'The real goal is not training accuracy. It is useful behaviour on unseen data.',
      },
      {
        id: 'loop',
        title: 'The learning loop',
        body: [
          'Define a task and measurable objective.',
          'Collect and prepare representative data.',
          'Choose a model and fit its parameters on training data.',
          'Evaluate on validation data, make decisions, and reserve test data for final evidence.',
          'Inspect errors and iterate on data, features, modelling assumptions, and evaluation.',
        ],
      },
      {
        id: 'model',
        title: 'A compact mathematical view',
        body: [
          'A model maps an input x to an output estimate. Learning chooses parameters that make those estimates useful under a loss or evaluation criterion.',
        ],
        formula: '\\hat{y} = f_{\\theta}(x)',
      },
      {
        id: 'mistakes',
        title: 'Common early mistakes',
        body: [
          'Treating all available data as training data.',
          'Assuming a more complex model is automatically a better model.',
          'Using a metric that does not match the practical cost of errors.',
          'Ignoring how the data was collected and whether it represents deployment conditions.',
        ],
      },
    ],
    sourceNote:
      'Aligned with the studio curriculum on AI/ML foundations, training data, unseen data, and experimental discipline.',
  },
  {
    slug: 'learning-paradigms',
    title: 'Learning Paradigms',
    eyebrow: 'Module 1 · Foundations',
    oneLine: 'The kind of feedback available to the learner determines the learning paradigm.',
    summary:
      'Compare supervised, unsupervised, semi-supervised, self-supervised, and reinforcement learning by asking one question: what signal tells the model that it is improving?',
    difficulty: 'Foundation',
    moduleSlug: 'introduction-and-data',
    estimatedMinutes: 16,
    prerequisites: ['what-is-machine-learning'],
    learnNext: ['regression-vs-classification', 'data-preprocessing'],
    related: ['k-means-clustering', 'reinforcement-learning'],
    tags: ['supervised', 'unsupervised', 'reinforcement', 'labels'],
    sections: [
      {
        id: 'supervised',
        title: 'Supervised learning',
        body: [
          'Each training example includes an input and a target. The model learns to predict targets for new inputs.',
          'Regression predicts continuous values; classification predicts discrete classes or class probabilities.',
        ],
      },
      {
        id: 'unsupervised',
        title: 'Unsupervised learning',
        body: [
          'Training examples do not include target labels. The system searches for structure such as groups, lower-dimensional representations, or recurring associations.',
        ],
      },
      {
        id: 'spectrum',
        title: 'A spectrum of supervision',
        body: [
          'Semi-supervised learning combines a smaller labelled set with a larger unlabelled set.',
          'Self-supervised learning creates a training signal from the data itself, often by hiding or transforming part of an example and asking the model to recover it.',
          'Reinforcement learning uses rewards from interaction rather than a fixed label for every decision.',
        ],
        callout: 'Do not choose a paradigm by fashion. Choose it from the feedback your problem and data can genuinely provide.',
      },
    ],
    sourceNote:
      'The supplied Module 1 slides explicitly present learning paradigms, supervised examples, clustering, and reinforcement learning.',
  },
  {
    slug: 'regression-vs-classification',
    title: 'Regression vs. Classification',
    eyebrow: 'Modules 1–2 · Supervised Learning',
    oneLine: 'Regression predicts quantities; classification predicts categories or their probabilities.',
    summary:
      'Recognise the target type before selecting an algorithm, metric, or visualization. This distinction shapes the entire modelling workflow.',
    difficulty: 'Foundation',
    moduleSlug: 'supervised-learning',
    estimatedMinutes: 18,
    prerequisites: ['what-is-machine-learning', 'learning-paradigms'],
    learnNext: ['linear-regression', 'logistic-regression'],
    related: ['model-evaluation', 'training-validation-test'],
    tags: ['regression', 'classification', 'target', 'supervised'],
    sections: [
      {
        id: 'regression',
        title: 'Regression',
        body: [
          'The target is continuous: salary, demand, temperature, duration, or price.',
          'A simple linear model expresses the prediction as an intercept plus a coefficient multiplied by the input.',
        ],
        formula: '\\hat{y} = w_0 + w_1x',
      },
      {
        id: 'classification',
        title: 'Classification',
        body: [
          'The target is categorical: approved or rejected, benign or malignant, indoor or outdoor.',
          'A binary classifier may first compute a score, transform it into a probability with a sigmoid, and then apply a decision threshold.',
        ],
        formula: 'P(y=1\\mid x)=\\sigma(w_0+w_1x)',
      },
      {
        id: 'decision',
        title: 'How to decide',
        body: [
          'Ask what the desired output means, not which algorithm you want to use.',
          'A number can still represent a class code, and a class probability is still part of a classification task. The semantic meaning of the target decides the task type.',
        ],
      },
    ],
    labHref: '/labs/linear-regression',
    sourceNote:
      'Derived from the supplied Module 1 regression and classification examples and the supervised-learning course schedule.',
  },
  {
    slug: 'data-preprocessing',
    title: 'Data Preprocessing',
    eyebrow: 'Module 1 · Data',
    oneLine: 'Preprocessing makes raw data usable without leaking future information into the model.',
    summary:
      'Inspect data quality, handle missing values, align representations, treat outliers deliberately, and build transformations that can be repeated consistently on validation, test, and production data.',
    difficulty: 'Foundation',
    moduleSlug: 'introduction-and-data',
    estimatedMinutes: 22,
    prerequisites: ['what-is-machine-learning'],
    learnNext: ['feature-scaling', 'categorical-encoding', 'training-validation-test'],
    related: ['class-imbalance', 'pipelines'],
    tags: ['data', 'missing values', 'outliers', 'cleaning'],
    sections: [
      {
        id: 'why',
        title: 'Why preprocessing is necessary',
        body: [
          'Raw datasets frequently contain missing or incorrect values, duplicates, incompatible formats, irrelevant records, and features measured on very different scales.',
          'A model can only learn from the representation it receives. Poorly designed preprocessing can hide useful information or introduce misleading patterns.',
        ],
      },
      {
        id: 'missing',
        title: 'Missing data',
        body: [
          'Deletion may be reasonable when the affected portion is small and missingness does not distort the population.',
          'Imputation may use a constant, mean, median, mode, or a model-based estimate. The choice depends on the amount, pattern, and importance of missingness.',
        ],
      },
      {
        id: 'leakage',
        title: 'Fit transformations on training data only',
        body: [
          'Statistics such as the mean, standard deviation, minimum, maximum, category vocabulary, or imputation value must be learned from the training split.',
          'Those learned parameters are then applied unchanged to validation and test data. Computing them on the full dataset leaks information and makes evaluation optimistic.',
        ],
        callout: 'A preprocessing step is part of the model pipeline and must obey the same train/validation/test boundary.',
      },
    ],
    sourceNote:
      'The supplied Module 1 slides cover data quality, missing values, scaling, outliers, and categorical variables; leakage guidance is added as standard educational context.',
  },
  {
    slug: 'feature-scaling',
    title: 'Normalization and Standardization',
    eyebrow: 'Module 1 · Data',
    oneLine: 'Scaling changes numerical units so model behaviour is not dominated by arbitrary measurement ranges.',
    summary:
      'Compare min–max normalization with z-score standardization, understand their equations, and connect the choice to model geometry and outliers.',
    difficulty: 'Foundation',
    moduleSlug: 'introduction-and-data',
    estimatedMinutes: 20,
    prerequisites: ['data-preprocessing'],
    learnNext: ['knn', 'support-vector-machines', 'k-means-clustering'],
    related: ['principal-component-analysis', 'gradient-descent'],
    tags: ['normalization', 'standardization', 'scaling', 'z-score'],
    sections: [
      {
        id: 'motivation',
        title: 'Why scale features?',
        body: [
          'Distance-based and gradient-based methods can be strongly affected when one feature has numerically larger values simply because of its unit.',
          'Scaling gives features a comparable numerical footing; it does not guarantee that every feature is equally informative.',
        ],
      },
      {
        id: 'normalization',
        title: 'Min–max normalization',
        body: [
          'Min–max scaling maps the observed range to a fixed interval, usually zero to one. It preserves ordering but is sensitive to extreme values because the endpoints define the transformation.',
        ],
        formula: "x' = \\frac{x-x_{\\min}}{x_{\\max}-x_{\\min}}",
      },
      {
        id: 'standardization',
        title: 'Z-score standardization',
        body: [
          'Standardization centers a feature at zero and scales it by its standard deviation. Values may be positive or negative.',
        ],
        formula: 'z = \\frac{x-\\mu}{\\sigma}',
      },
      {
        id: 'choice',
        title: 'Choosing deliberately',
        body: [
          'Use min–max scaling when a bounded range is meaningful and extreme outliers are not dominant.',
          'Use standardization when zero-centered units are useful, especially for models such as logistic regression, SVM, PCA, K-means, and neural networks.',
        ],
      },
    ],
    sourceNote:
      'Directly aligned with the supplied Module 1 slides on scaling, normalization, standardization, formulas, properties, and model use cases.',
  },
  {
    slug: 'categorical-encoding',
    title: 'Encoding Categorical Variables',
    eyebrow: 'Module 1 · Data',
    oneLine: 'Encoding converts categories into numerical representations without inventing relationships that are not present.',
    summary:
      'Distinguish ordinal from nominal variables, then use label or one-hot encoding in a way that preserves the meaning of the categories.',
    difficulty: 'Foundation',
    moduleSlug: 'introduction-and-data',
    estimatedMinutes: 16,
    prerequisites: ['data-preprocessing'],
    learnNext: ['linear-regression', 'decision-trees'],
    related: ['feature-engineering', 'pipelines'],
    tags: ['categorical', 'one-hot', 'label encoding', 'ordinal', 'nominal'],
    sections: [
      {
        id: 'ordinal',
        title: 'Ordinal variables',
        body: [
          'Ordinal categories have a meaningful order, such as low, medium, and high. Integer encoding can represent that order when the numerical spacing is treated with appropriate caution.',
        ],
      },
      {
        id: 'nominal',
        title: 'Nominal variables',
        body: [
          'Nominal categories such as colour, city, country, or brand have no natural ranking.',
          'One-hot encoding creates a separate binary feature for each category and avoids implying that one category is numerically greater than another.',
        ],
      },
      {
        id: 'unknown',
        title: 'Production consideration: unseen categories',
        body: [
          'The encoder must define what happens when a category appears after training. Common options include an explicit “unknown” bucket, robust hashing, or controlled vocabulary updates followed by retraining.',
        ],
      },
    ],
    sourceNote:
      'Directly aligned with the supplied Module 1 slides on ordinal/nominal data, label encoding, one-hot encoding, and rule-of-thumb selection.',
  },
  {
    slug: 'linear-regression',
    title: 'Linear Regression',
    eyebrow: 'Module 2 · Supervised Learning',
    oneLine: 'Linear regression chooses a line or hyperplane that minimizes prediction error under a specified objective.',
    summary:
      'Move from geometric intuition to the linear model, residuals, mean squared error, and gradient-based parameter updates.',
    difficulty: 'Intermediate',
    moduleSlug: 'supervised-learning',
    estimatedMinutes: 28,
    prerequisites: ['regression-vs-classification', 'feature-scaling'],
    learnNext: ['gradient-descent', 'model-evaluation'],
    related: ['regularization', 'logistic-regression'],
    tags: ['linear regression', 'residuals', 'MSE', 'supervised'],
    sections: [
      {
        id: 'geometry',
        title: 'Geometric intuition',
        body: [
          'Each point represents an observed input and target. The fitted line produces a prediction at every input.',
          'A residual is the signed vertical difference between an observation and its prediction. The objective aggregates those residuals into a scalar measure of fit.',
        ],
      },
      {
        id: 'model',
        title: 'Model and objective',
        body: [
          'For one feature, the model has an intercept and slope. Mean squared error penalizes larger residuals more strongly because each error is squared.',
        ],
        formula: '\\operatorname{MSE}=\\frac{1}{n}\\sum_{i=1}^{n}(y_i-(w_0+w_1x_i))^2',
      },
      {
        id: 'implementation',
        title: 'Implementation sketch',
        body: ['A high-level library fit is useful, but computing the closed-form line or gradient updates exposes the mechanism.'],
        code: `from sklearn.linear_model import LinearRegression\n\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\npredictions = model.predict(X_test)`,
      },
      {
        id: 'limits',
        title: 'Practical limits',
        body: [
          'A linear relationship may be too restrictive.',
          'Outliers can strongly influence a squared-error fit.',
          'Correlated features can make coefficient interpretation unstable.',
          'A good in-sample line is not evidence of good generalization; use proper validation.',
        ],
      },
    ],
    labHref: '/labs/linear-regression',
    sourceNote:
      'The reference curriculum covers simple and multiple linear regression, gradient descent, and regression metrics. Explanatory detail follows standard educational conventions.',
  },
  {
    slug: 'knn',
    title: 'K-Nearest Neighbours',
    eyebrow: 'Module 2 · Classification',
    oneLine: 'KNN predicts from the labels or values of nearby training examples.',
    summary:
      'Understand neighbourhood geometry, the role of K, distance metrics, feature scaling, and the bias–variance trade-off in an instance-based learner.',
    difficulty: 'Intermediate',
    moduleSlug: 'supervised-learning',
    estimatedMinutes: 20,
    prerequisites: ['regression-vs-classification', 'feature-scaling'],
    learnNext: ['decision-trees', 'model-evaluation'],
    related: ['k-means-clustering', 'bias-and-variance'],
    tags: ['KNN', 'distance', 'classification', 'neighbours'],
    sections: [
      {
        id: 'algorithm',
        title: 'Algorithm',
        body: [
          'Measure the distance from the query point to each training example.',
          'Select the K closest examples.',
          'For classification, predict by a vote; for regression, aggregate their target values.',
        ],
      },
      {
        id: 'k',
        title: 'What K controls',
        body: [
          'A very small K follows local detail and can be sensitive to noise.',
          'A large K produces a smoother decision region but may wash out smaller genuine structures.',
        ],
        callout: 'K is a model-complexity control, not just an arbitrary integer.',
      },
      {
        id: 'scaling',
        title: 'Why scaling matters',
        body: [
          'Because KNN relies directly on distance, a feature with a wider numerical range can dominate the neighbourhood unless the representation is deliberately scaled.',
        ],
      },
    ],
    labHref: '/labs/knn',
    sourceNote:
      'KNN is explicitly included in Module 2 and its practice schedule. Explanatory detail is standard educational content.',
  },
  {
    slug: 'k-means-clustering',
    title: 'K-Means Clustering',
    eyebrow: 'Module 3 · Unsupervised Learning',
    oneLine: 'K-means alternates between assigning points to centroids and moving centroids to cluster means.',
    summary:
      'Watch an iterative unsupervised algorithm discover compact groups, then examine initialization, convergence, scaling, and failure modes.',
    difficulty: 'Intermediate',
    moduleSlug: 'unsupervised-learning',
    estimatedMinutes: 24,
    prerequisites: ['learning-paradigms', 'feature-scaling'],
    learnNext: ['principal-component-analysis', 'model-evaluation'],
    related: ['knn', 'dbscan', 'hierarchical-clustering'],
    tags: ['K-means', 'clustering', 'centroid', 'unsupervised'],
    sections: [
      {
        id: 'loop',
        title: 'The alternating loop',
        body: [
          'Initialize K centroids.',
          'Assign each sample to its nearest centroid.',
          'Replace each centroid with the mean of its assigned samples.',
          'Repeat until assignments or centroid positions stop changing meaningfully.',
        ],
      },
      {
        id: 'objective',
        title: 'Objective',
        body: [
          'The algorithm seeks compact clusters by minimizing the within-cluster sum of squared distances.',
        ],
        formula: '\\sum_{k=1}^{K}\\sum_{x_i\\in C_k}\\lVert x_i-\\mu_k\\rVert^2',
      },
      {
        id: 'limits',
        title: 'Where it struggles',
        body: [
          'Different initial centroids can produce different solutions.',
          'Non-spherical clusters, unequal densities, and strong outliers can violate the geometry K-means assumes.',
          'K must be chosen rather than discovered automatically.',
        ],
      },
    ],
    labHref: '/labs/kmeans',
    sourceNote:
      'K-means, K-medoids, clustering metrics, and repeated K-means practice are explicitly included in Module 3.',
  },
  {
    slug: 'model-evaluation',
    title: 'Classification Evaluation',
    eyebrow: 'Modules 2–4 · Evaluation',
    oneLine: 'A metric translates model outcomes into evidence for a particular decision context.',
    summary:
      'Use the confusion matrix to connect individual outcomes to accuracy, precision, recall, and F1, then understand why no metric is universally best.',
    difficulty: 'Intermediate',
    moduleSlug: 'supervised-learning',
    estimatedMinutes: 22,
    prerequisites: ['regression-vs-classification'],
    learnNext: ['training-validation-test', 'bias-and-variance'],
    related: ['class-imbalance', 'threshold-selection'],
    tags: ['confusion matrix', 'precision', 'recall', 'F1', 'accuracy'],
    sections: [
      {
        id: 'matrix',
        title: 'Four outcomes',
        body: [
          'True positive and true negative are correct decisions.',
          'False positive and false negative are different kinds of mistakes, and their practical costs may be very different.',
        ],
      },
      {
        id: 'metrics',
        title: 'Metrics from the matrix',
        body: [
          'Accuracy measures the share of all predictions that are correct.',
          'Precision asks: among predicted positives, how many are truly positive?',
          'Recall asks: among actual positives, how many did the model find?',
          'F1 is the harmonic mean of precision and recall.',
        ],
        formula: 'F_1 = 2\\cdot\\frac{\\text{precision}\\cdot\\text{recall}}{\\text{precision}+\\text{recall}}',
      },
      {
        id: 'context',
        title: 'Metric choice is a decision',
        body: [
          'When classes are imbalanced, accuracy can hide poor minority-class performance.',
          'Choose metrics from the cost of false positives and false negatives, the operating threshold, and the decision the model supports.',
        ],
      },
    ],
    labHref: '/labs/confusion-matrix',
    sourceNote:
      'Classification metrics are part of the studio curriculum; detailed definitions follow standard statistical-learning conventions.',
  },
  {
    slug: 'training-validation-test',
    title: 'Training, Validation, and Test Sets',
    eyebrow: 'Modules 1–4 · Practice',
    oneLine: 'Separate data by purpose so model development and final evaluation do not contaminate each other.',
    summary:
      'Learn what each split is for, how leakage occurs, and why the test set must remain untouched until the modelling process is effectively complete.',
    difficulty: 'Foundation',
    moduleSlug: 'introduction-and-data',
    estimatedMinutes: 15,
    prerequisites: ['what-is-machine-learning'],
    learnNext: ['model-evaluation', 'bias-and-variance'],
    related: ['data-preprocessing', 'cross-validation'],
    tags: ['training set', 'validation set', 'test set', 'leakage'],
    sections: [
      {
        id: 'roles',
        title: 'Three distinct jobs',
        body: [
          'Training data estimates model parameters.',
          'Validation data guides model and hyperparameter decisions.',
          'Test data provides a final, relatively unbiased estimate after those decisions are complete.',
        ],
      },
      {
        id: 'leakage',
        title: 'Leakage',
        body: [
          'Any information from validation or test examples that influences training or preprocessing makes the evaluation less trustworthy.',
          'Repeatedly checking the test set and changing the model in response effectively turns the test set into another validation set.',
        ],
        callout: 'A test set is valuable because of what you have not done with it.',
      },
    ],
    sourceNote:
      'Training, validation, and test terminology is explicitly included in Module 1. Leakage guidance is standard educational context.',
  },
];

export const findTopic = (slug: string) => topics.find((topic) => topic.slug === slug);

export const topicsByModule = (moduleSlug: string) =>
  topics.filter((topic) => topic.moduleSlug === moduleSlug);
