以下の手順でGitHub Issueの$ARGUMENTSを解析・修正してください。

1. `gh issue view`でIssueの詳細を取得
2. Issueに記載された問題を理解
3. リモートリポジトリで`develop`ブランチからIssue対応のための`feature/{Issueの概要}`ブランチを作成
4. ローカルブランチを`feature/{Issueの概要}`ブランチに切り替え
5. コードベースを検索し、関連ファイルを特定
6. 問題を解決するための変更を実装
7. 実装したコードにエラーが出ていないことを確認
8. コードがリントと型チェックを通過することを確認
9. 分かりやすいコミットメッセージを作成
10. 変更をpushし、`feature/{Issueの概要}`から`develop`ブランチへのPRを作成

GitHub 関連の操作はすべて GitHub CLI (gh) を使用してください。