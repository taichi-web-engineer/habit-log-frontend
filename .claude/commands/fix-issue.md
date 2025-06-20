以下の手順でGitHub Issue の $ARGUMENTS を解析・修正してください。

1. gh issue view で Issue の詳細を取得
2. Issueに記載された問題を理解
3. リモートリポジトリで develop ブランチから Issue 対応のための`feature/{Issueの概要}`ブランチを作成
4. ローカルブランチを`feature/{Issueの概要}`ブランチに切り替え
5. コードベースを検索し、関連ファイルを特定
6. 問題を解決するための変更を実装
7. コードがリントと型チェックを通過することを確認
8. 分かりやすいコミットメッセージを作成
9. 変更を push し、`feature/{Issueの概要}` -> `develop` の PR を作成

GitHub 関連の操作はすべて GitHub CLI (gh) を使用してください。