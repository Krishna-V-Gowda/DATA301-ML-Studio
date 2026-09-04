# Limitations

- The algorithms are deliberately small, two-dimensional, and educational; they are not substitutes for optimized scientific libraries.
- Several demonstrations use deterministic toy datasets so that behavior remains legible.
- Numerical routines use JavaScript `number` arithmetic and do not expose arbitrary precision.
- Polynomial normal equations can become ill-conditioned at high degree despite a small ridge term.
- PCA is implemented only for two dimensions.
- K-means emphasizes visible assignment and centroid-update mechanics rather than a production convergence controller.
- The optional Supabase workflow requires external configuration and has not been penetration-tested.
- The public edition excludes institution-specific binaries and cannot reproduce private resource handoffs.
- Source structure and CSS address baseline accessibility concerns, but deployed browser and assistive-technology review is still required.
- A successful dependency audit is time-bound. The lockfile and CI make the installed graph inspectable; they do not eliminate future advisories.
