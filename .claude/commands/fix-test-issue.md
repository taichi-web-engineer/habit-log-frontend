以下の手順でGitHub Issueの$ARGUMENTSを解析・修正してください。

1. `gh issue view`でIssueの詳細を取得
2. Issueの記載内容を理解
3. リモートリポジトリで`develop`ブランチからIssue対応のための`feature/{Issueの概要}`ブランチを作成
4. ローカルブランチを`feature/{Issueの概要}`ブランチに切り替え
5. コードベースを検索し、関連ファイルを特定
6. テスト規約`.claude/unit-test-terms.md`にのっとってIssueのテストを実装。
7. `pnpm tsc --noEmit`でエラーが出ないことを確認
8. `pnpm biome check --write`でリントと型チェックを通過することを確認
9. 分かりやすいコミットメッセージを作成
10. 変更をpushしてPRを作成

GitHub 関連の操作はすべて GitHub CLI (gh) を使用してください。
