# Versioning

AudioMeta releases from `main`. The Conventional Commits PR title becomes the
squash commit subject and supplies the entry in [CHANGELOG.md](../CHANGELOG.md).
Use `feat` for a minor release, `fix` for a patch, and `!` for a breaking change.
Use `docs` for documentation-only changes. See the [SemVer guide](SEMVER_GUIDE.md).

1. The [Release workflow](../.github/workflows/release.yml) runs on each push to
   `main`. Release Please opens or updates a release PR when there are releasable
   changes. That PR updates `package.json`, the release manifest and `CHANGELOG.md`.
2. The workflow enables auto-merge for the release PR. After the required checks
   pass and it merges, the next workflow run tags that merge commit with `vX.Y.Z`.
3. Vercel deploys production on merges to `main`, including the release PR.
   The tag records the released version.

Release Please owns changes to the changelog, `package.json` version and
`.release-please-manifest.json`. Leave those files to the release PR and leave
tag creation to CI. Use the Git tag to identify the published version.
