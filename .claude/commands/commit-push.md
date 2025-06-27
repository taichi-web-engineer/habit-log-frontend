以下の手順で現在の変更をcommit、GitHubにpushしてください。

1. `pnpm tsc --noEmit`でエラーが出ないことを確認
2. `pnpm biome check --write --unsafe`でリントと型チェックを通過することを確認
3. `pnpm test`でテストがパスすることを確認
4. 必要に応じて変更のまとまりごとにcommitを分割して日本語のメッセージでcommit
5. 変更をpush

GitHub 関連の操作はすべて GitHub CLI (gh) を使用してください。
