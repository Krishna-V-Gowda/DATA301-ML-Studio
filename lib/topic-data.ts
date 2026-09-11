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
      'Aligned with the supplied Module 1 slides on AI/ML foundations, training data, unseen data, and the course plan.',
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
      'The supplied course schedule explicitly covers simple and multiple linear regression, gradient descent, and regression metrics. Explanatory detail is standard educational content.',
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
      'Classification metrics are explicitly included in the course plan. Detailed metric definitions are standard educational content.',
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
  {
    slug: 'supervised-learning',
    title: 'Supervised Learning',
    eyebrow: 'Module 2 · Supervised Learning',
    oneLine: 'Supervised learning estimates a mapping from labelled feature–target pairs and applies it to unseen samples.',
    summary:
      'Establish the labelled-learning workflow, distinguish regression from classification, and understand what the model sees during training versus what it must infer at prediction time.',
    difficulty: 'Foundation',
    moduleSlug: 'supervised-learning',
    estimatedMinutes: 16,
    prerequisites: ['what-is-machine-learning', 'learning-paradigms'],
    learnNext: ['regression-vs-classification', 'linear-regression', 'logistic-regression'],
    related: ['training-validation-test', 'model-evaluation'],
    tags: ['supervised learning', 'features', 'target', 'labelled data'],
    sections: [
      {
        id: 'labelled-examples',
        title: 'Learning from labelled examples',
        body: [
          'Every training example contains an input feature vector and its corresponding target. The model uses many such pairs to estimate a relationship that can be applied to a new sample.',
          'The target is available while the model is being trained. At inference time, only the features are provided and the target must be predicted.',
        ],
        formula: '(\\mathbf{x}^{(i)},y^{(i)}) \\longrightarrow f_{\\theta} \\longrightarrow \\hat{y}^{(i)}',
      },
      {
        id: 'learning-process',
        title: 'The learning process',
        body: [
          'Provide labelled examples, choose a model family, estimate its parameters, and measure how predictions differ from known targets.',
          'The quality of a supervised model is ultimately judged on representative data that was not used to fit those parameters.',
        ],
      },
      {
        id: 'two-problem-families',
        title: 'Regression and classification',
        body: [
          'Regression predicts a numerical quantity such as price, temperature, marks, or demand.',
          'Classification predicts a category or class probability such as spam/not-spam, pass/fail, or disease/no-disease.',
        ],
        callout: 'The meaning of the target—not the algorithm name—determines whether the task is regression or classification.',
      },
      {
        id: 'generalization',
        title: 'Generalization is the real objective',
        body: [
          'A model can match its training examples and still fail on unseen cases. Good supervised learning balances fit with the ability to generalize beyond the examples used during training.',
        ],
      },
    ],
    labHref: '/labs/logistic-regression',
    sourceNote:
      'Directly aligned with Module 2 slides 4–5, which define supervised learning through labelled feature–target pairs and distinguish regression from classification.',
  },
  {
    slug: 'gradient-descent',
    title: 'Gradient Descent',
    eyebrow: 'Module 2 · Regression & Optimization',
    oneLine: 'Gradient descent repeatedly moves model parameters opposite the gradient to reduce a cost function.',
    summary:
      'See optimization as a sequence of measurable parameter updates, then connect learning rate, convergence, overshooting, and batch size to the behaviour of the cost curve.',
    difficulty: 'Intermediate',
    moduleSlug: 'supervised-learning',
    estimatedMinutes: 26,
    prerequisites: ['linear-regression'],
    learnNext: ['multiple-linear-regression', 'regression-metrics'],
    related: ['feature-scaling', 'bias-variance'],
    tags: ['gradient descent', 'learning rate', 'optimization', 'cost'],
    sections: [
      {
        id: 'intuition',
        title: 'Move downhill on the cost surface',
        body: [
          'The gradient points in the direction of steepest increase. Moving in the opposite direction changes the parameters toward a lower cost.',
          'The process begins with an initial parameter guess and repeats until the cost stops changing meaningfully or another stopping rule is reached.',
        ],
      },
      {
        id: 'update-rule',
        title: 'Parameter update rule',
        body: [
          'Each parameter is updated using its partial derivative. All parameters for an iteration must be computed from the same pre-update state and then changed simultaneously.',
        ],
        formula: '\\theta_j \\leftarrow \\theta_j-\\alpha\\frac{\\partial J(\\theta)}{\\partial \\theta_j}',
      },
      {
        id: 'learning-rate',
        title: 'Learning rate and convergence',
        body: [
          'A learning rate that is too small produces slow progress and may require many iterations.',
          'A learning rate that is too large can overshoot the minimum, oscillate, or cause the cost to diverge.',
        ],
        callout: 'The learning rate controls step size; it does not tell the algorithm which direction to move.',
      },
      {
        id: 'batching',
        title: 'Batch, stochastic, and mini-batch updates',
        body: [
          'Batch gradient descent uses all training examples for each update. Stochastic gradient descent uses one example. Mini-batch gradient descent uses a subset and is common in practice.',
          'These variants use the same optimization principle but differ in the amount of data contributing to each gradient estimate.',
        ],
      },
    ],
    labHref: '/labs/gradient-descent',
    sourceNote:
      'Directly aligned with Module 2 slides 14–32, including the update rule, batch/stochastic/mini-batch variants, learning-rate behaviour, and the worked regression example.',
  },
  {
    slug: 'multiple-linear-regression',
    title: 'Multiple Linear Regression',
    eyebrow: 'Module 2 · Regression',
    oneLine: 'Multiple linear regression predicts a numerical target from a weighted combination of several features.',
    summary:
      'Extend the one-feature line into a higher-dimensional hyperplane, interpret coefficients carefully, and understand why feature scale affects gradient-based optimization.',
    difficulty: 'Intermediate',
    moduleSlug: 'supervised-learning',
    estimatedMinutes: 22,
    prerequisites: ['linear-regression', 'gradient-descent'],
    learnNext: ['regression-metrics', 'bias-variance'],
    related: ['feature-scaling', 'training-validation-test'],
    tags: ['multiple regression', 'features', 'coefficients', 'MSE'],
    sections: [
      {
        id: 'model',
        title: 'From a line to a hyperplane',
        body: [
          'With several input features, the prediction is an intercept plus one weighted contribution from each feature.',
          'The fitted surface is a plane for two features and a hyperplane in higher dimensions.',
        ],
        formula: '\\hat{y}^{(i)}=\\theta_0+\\sum_{j=1}^{d}\\theta_jx_j^{(i)}',
      },
      {
        id: 'objective',
        title: 'Measure prediction error',
        body: [
          'The Module 2 worked example uses mean squared error and updates the intercept and feature coefficients with gradient descent.',
          'A lower cost indicates that the current parameter set produces predictions closer to the observed targets under the chosen objective.',
        ],
        formula: 'J(\\theta)=\\frac{1}{m}\\sum_{i=1}^{m}(\\hat{y}^{(i)}-y^{(i)})^2',
      },
      {
        id: 'scale',
        title: 'Why scale can destabilize optimization',
        body: [
          'When features have very different numerical ranges, their gradients can have very different magnitudes. A learning rate that appears reasonable for one coefficient may be far too large for another.',
          'The deck’s numerical example deliberately shows a large learning rate making the cost jump dramatically, followed by a smaller rate reducing the cost.',
        ],
      },
      {
        id: 'interpretation',
        title: 'Interpret coefficients conditionally',
        body: [
          'A coefficient describes the model’s change in prediction for one unit of a feature while the other included features are held constant.',
          'Correlation among predictors, encoding choices, scale, and omitted variables can all make causal interpretation inappropriate.',
        ],
      },
    ],
    labHref: '/labs/linear-regression',
    sourceNote:
      'Directly aligned with Module 2 slides 27–32, which provide a two-feature numerical example, gradient calculations, overshooting, and a smaller-learning-rate correction.',
  },
  {
    slug: 'regression-metrics',
    title: 'Regression Evaluation Metrics',
    eyebrow: 'Module 2 · Evaluation',
    oneLine: 'MAE, MSE, RMSE, and R² describe different aspects of regression error and explanatory fit.',
    summary:
      'Choose a regression metric by understanding its units, sensitivity to large errors, and relationship to the decision the model supports.',
    difficulty: 'Intermediate',
    moduleSlug: 'supervised-learning',
    estimatedMinutes: 20,
    prerequisites: ['linear-regression'],
    learnNext: ['training-validation-test', 'bias-variance'],
    related: ['model-evaluation', 'gradient-descent'],
    tags: ['MAE', 'MSE', 'RMSE', 'R²', 'residual'],
    sections: [
      {
        id: 'residuals',
        title: 'Begin with residuals',
        body: [
          'A residual is the difference between an observed target and the model prediction. Error metrics summarize a collection of residuals into evidence about model performance.',
        ],
        formula: 'e_i=y_i-\\hat{y}_i',
      },
      {
        id: 'mae',
        title: 'Mean Absolute Error',
        body: [
          'MAE averages absolute error magnitudes. It remains in the original target units and is less dominated by very large errors than squared-error metrics.',
        ],
        formula: '\\operatorname{MAE}=\\frac{1}{n}\\sum_{i=1}^{n}|y_i-\\hat{y}_i|',
      },
      {
        id: 'mse-rmse',
        title: 'MSE and RMSE',
        body: [
          'MSE squares each error, so large mistakes contribute disproportionately. RMSE takes the square root and returns the result to the target’s original units.',
        ],
        formula: '\\operatorname{RMSE}=\\sqrt{\\frac{1}{n}\\sum_{i=1}^{n}(y_i-\\hat{y}_i)^2}',
      },
      {
        id: 'r2',
        title: 'Coefficient of determination',
        body: [
          'R² compares residual variation with the total variation in the observed target. A value nearer one generally indicates that more variation is explained by the model on the evaluated data.',
          'R² is not a substitute for residual inspection, out-of-sample evaluation, or domain-relevant error analysis.',
        ],
        formula: 'R^2=1-\\frac{\\sum_i(y_i-\\hat{y}_i)^2}{\\sum_i(y_i-\\bar{y})^2}',
      },
    ],
    labHref: '/labs/linear-regression',
    sourceNote:
      'Directly aligned with Module 2 slides 33–38, which define and compare MAE, MSE, RMSE, and R². The caution about interpretation is added as standard evaluation guidance.',
  },
  {
    slug: 'logistic-regression',
    title: 'Logistic Regression',
    eyebrow: 'Module 2 · Classification',
    oneLine: 'Logistic regression maps a linear score through a sigmoid to estimate a binary-class probability.',
    summary:
      'Connect score, sigmoid, probability, threshold, class prediction, and parameter learning without confusing probability estimation with the final decision rule.',
    difficulty: 'Intermediate',
    moduleSlug: 'supervised-learning',
    estimatedMinutes: 27,
    prerequisites: ['supervised-learning', 'regression-vs-classification', 'gradient-descent'],
    learnNext: ['knn', 'decision-trees', 'model-evaluation'],
    related: ['class-imbalance', 'training-validation-test'],
    tags: ['logistic regression', 'sigmoid', 'probability', 'threshold'],
    sections: [
      {
        id: 'probability',
        title: 'Predict a probability first',
        body: [
          'For binary classification, logistic regression estimates the probability of the positive class. The probability of the other class is one minus that value.',
        ],
        formula: 'P(y=1\\mid x)=\\sigma(z)=\\frac{1}{1+e^{-z}}',
      },
      {
        id: 'score',
        title: 'Linear score, nonlinear output',
        body: [
          'The input features are combined linearly into a score. The sigmoid compresses that score into the interval from zero to one.',
          'Changing the coefficients moves or rotates the decision boundary; changing the threshold alters the final class assignment without retraining the probability model.',
        ],
        formula: 'z=\\theta_0+\\sum_{j=1}^{d}\\theta_jx_j',
      },
      {
        id: 'training',
        title: 'Learn parameters iteratively',
        body: [
          'The supplied Module 2 deck demonstrates gradient descent using mean squared error so students can follow the chain rule step by step.',
          'In conventional statistical and machine-learning implementations, binary cross-entropy (log loss) is normally used because it is the standard likelihood-based objective for logistic regression. The interactive lab focuses on probability and threshold behaviour rather than hiding this distinction.',
        ],
      },
      {
        id: 'decision',
        title: 'Probability is not the same as a decision',
        body: [
          'A threshold converts an estimated probability into a class label. The default 0.5 threshold is not universally optimal; the right operating point depends on class prevalence and the costs of false positives and false negatives.',
        ],
        callout: 'Train the probability model, then choose the decision threshold for the real operating context.',
      },
    ],
    labHref: '/labs/logistic-regression',
    sourceNote:
      'Directly aligned with Module 2 slides 48–59. The deck’s MSE-based worked derivation is preserved explicitly; the log-loss note is labelled as standard external practice rather than silently replacing the supplied framing.',
  },
  {
    slug: 'class-imbalance',
    title: 'Class Imbalance',
    eyebrow: 'Module 2 · Classification Practice',
    oneLine: 'Class imbalance can make a classifier appear accurate while failing the minority class that matters.',
    summary:
      'Recognize majority-class bias, compare data-level and algorithm-level remedies, and evaluate the model with metrics that expose minority-class performance.',
    difficulty: 'Intermediate',
    moduleSlug: 'supervised-learning',
    estimatedMinutes: 18,
    prerequisites: ['regression-vs-classification'],
    learnNext: ['model-evaluation', 'bias-variance'],
    related: ['logistic-regression', 'training-validation-test'],
    tags: ['imbalance', 'SMOTE', 'class weights', 'precision', 'recall'],
    sections: [
      {
        id: 'problem',
        title: 'When one class dominates',
        body: [
          'A dataset is imbalanced when class counts are highly unequal. A model can achieve high overall accuracy by predominantly predicting the majority class.',
          'That behaviour can be unacceptable when the minority class represents fraud, disease, failure, or another high-cost event.',
        ],
      },
      {
        id: 'data-level',
        title: 'Data-level strategies',
        body: [
          'Oversampling increases the representation of minority examples. Random oversampling and SMOTE are common approaches.',
          'Undersampling reduces majority examples, trading information for a more balanced training distribution.',
        ],
      },
      {
        id: 'algorithm-level',
        title: 'Algorithm-level strategies',
        body: [
          'Cost-sensitive learning or class weights assign greater penalty to errors on the minority class. Ensemble methods can also be designed to improve minority-class performance.',
        ],
      },
      {
        id: 'evaluation',
        title: 'Do not rely on accuracy alone',
        body: [
          'Inspect the confusion matrix and consider precision, recall, F1, and threshold curves. The right emphasis depends on which type of error is more consequential.',
        ],
        callout: 'A metric can only expose what its denominator and error trade-off were designed to measure.',
      },
    ],
    labHref: '/labs/roc-pr',
    sourceNote:
      'Directly aligned with Module 2 slides 43–46, which define imbalance, discuss majority-class bias, oversampling, undersampling, class weights, ensembles, and the need for metrics beyond accuracy.',
  },
  {
    slug: 'decision-trees',
    title: 'Decision Trees',
    eyebrow: 'Module 2 · Classification',
    oneLine: 'A decision tree recursively partitions the feature space with interpretable if–then rules.',
    summary:
      'Understand root, internal, branch, and leaf nodes; then see how entropy, information gain, and Gini impurity guide recursive split selection.',
    difficulty: 'Intermediate',
    moduleSlug: 'supervised-learning',
    estimatedMinutes: 30,
    prerequisites: ['regression-vs-classification'],
    learnNext: ['bias-variance', 'model-evaluation'],
    related: ['class-imbalance', 'ensemble-learning'],
    tags: ['decision tree', 'entropy', 'information gain', 'Gini'],
    sections: [
      {
        id: 'structure',
        title: 'A sequence of decisions',
        body: [
          'The root node contains the first split. Internal nodes apply feature-based conditions, branches represent outcomes, and leaf nodes provide the final prediction.',
          'Prediction follows one path from the root through the learned conditions until a leaf is reached.',
        ],
      },
      {
        id: 'learning',
        title: 'What the tree learns at each node',
        body: [
          'The algorithm chooses which feature to use, the rule or threshold for the split, and whether further splitting is justified.',
          'A useful split produces child nodes that are purer or more informative with respect to the target classes.',
        ],
      },
      {
        id: 'entropy',
        title: 'Entropy and information gain',
        body: [
          'Entropy measures class uncertainty. Information gain measures the reduction in entropy produced by a candidate split.',
          'Under an information-gain criterion, the tree chooses the split with the highest gain.',
        ],
        formula: 'H(S)=-\\sum_{i=1}^{C}p_i\\log_2 p_i',
      },
      {
        id: 'gini',
        title: 'Gini impurity',
        body: [
          'Gini impurity measures how mixed the classes are within a node. A value of zero indicates a pure node.',
          'Under a Gini criterion, the tree chooses the candidate split with the lowest weighted child impurity.',
        ],
        formula: '\\operatorname{Gini}(S)=1-\\sum_{i=1}^{C}p_i^2',
      },
      {
        id: 'complexity',
        title: 'Control complexity',
        body: [
          'Trees are easy to inspect and do not require feature scaling, but deep trees can fit noise and become unstable.',
          'Depth limits, minimum samples, pruning, and validation are used to manage the trade-off between underfitting and overfitting.',
        ],
      },
    ],
    labHref: '/labs/decision-tree',
    sourceNote:
      'Directly aligned with Module 2 slides 74–106, including tree structure, recursive splitting, entropy, information gain, Gini impurity, examples, advantages, and overfitting risk.',
  },
  {
    slug: 'bias-variance',
    title: 'Bias, Variance, and Model Complexity',
    eyebrow: 'Module 2 · Generalization',
    oneLine: 'Bias and variance diagnose whether a model is too simple, too sensitive to training data, or both.',
    summary:
      'Relate training and validation error to underfitting, proper fit, overfitting, and the complexity required to generalize rather than memorize.',
    difficulty: 'Intermediate',
    moduleSlug: 'supervised-learning',
    estimatedMinutes: 20,
    prerequisites: ['training-validation-test', 'model-evaluation'],
    learnNext: ['regularization', 'cross-validation'],
    related: ['decision-trees', 'class-imbalance'],
    tags: ['bias', 'variance', 'overfitting', 'generalization', 'complexity'],
    sections: [
      {
        id: 'fit',
        title: 'Underfitting, proper fit, and overfitting',
        body: [
          'An underfit model is too simple to capture the underlying pattern and performs poorly on both training and unseen data.',
          'A well-matched model captures useful structure and generalizes. An overfit model follows training-specific detail or noise and performs much worse on unseen data.',
        ],
      },
      {
        id: 'diagnosis',
        title: 'Diagnose with training and validation error',
        body: [
          'High training error suggests high bias under the assumptions used in the supplied example.',
          'A large increase from training error to validation error indicates high variance. Both problems can occur together.',
        ],
      },
      {
        id: 'complexity',
        title: 'Complexity is a control, not a trophy',
        body: [
          'A simple linear model may miss a nonlinear pattern. A highly flexible model may track every training observation while becoming fragile outside the training set.',
          'The aim is not maximum complexity; it is the level of complexity that yields reliable performance on representative unseen data.',
        ],
        callout: 'The goal is to learn the underlying pattern, not memorize the training data.',
      },
      {
        id: 'response',
        title: 'Respond to the diagnosis',
        body: [
          'High bias may call for better features, a more expressive model, or reduced regularization.',
          'High variance may call for more representative data, stronger regularization, simpler models, better validation, or more stable ensembles.',
        ],
      },
    ],
    labHref: '/labs/overfitting',
    sourceNote:
      'Directly aligned with Module 2 slides 107–110, which compare train/test performance, underfitting, proper fit, overfitting, bias, variance, and simple versus complex models.',
  },

];

export const findTopic = (slug: string) => topics.find((topic) => topic.slug === slug);

export const topicsByModule = (moduleSlug: string) =>
  topics.filter((topic) => topic.moduleSlug === moduleSlug);
