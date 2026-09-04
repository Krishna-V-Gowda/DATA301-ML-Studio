# Mathematical validation

The test strategy has three layers.

## Worked examples

Exact small datasets fix definitions for OLS, KNN, K-means, classification metrics, logistic decisions, gradient descent, PCA, polynomial regression, trees, linear SVM, ROC/PR, and bagging.

## Degenerate and boundary cases

Tests cover constant predictors, empty metric denominators, empty clusters, bounded iteration counts, threshold extremes, deterministic ties, and low-rank PCA inputs.

## Metamorphic invariants

Properties catch defects that a single example can miss:

- translating every response changes an OLS intercept but not its slope;
- KNN is invariant to row permutation when distances and votes are unique;
- replicated confusion counts preserve all ratios;
- PCA eigenvalues and directions are invariant to translation;
- increasing a logistic threshold cannot increase positive predictions;
- decision-tree predictions are invariant to row order when the optimum split is unique;
- strictly increasing score transforms preserve ROC AUC.

These tests validate the implemented definitions. They do not establish numerical equivalence with every library, solver, tie policy, or floating-point platform.
