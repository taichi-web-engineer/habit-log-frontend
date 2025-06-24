# Unit Testルール

## 概要
本ドキュメントは、プロジェクトにおけるUnit Testコードの標準的な書き方を定義します。

## ディレクトリ構造
- テストファイルは対象モジュールと同じディレクトリ内の `__tests__` フォルダに配置
- テストファイル名は `{対象ファイル名}.test.ts` の形式

## テストケースの定義

### 型定義
テストケースは型安全に管理するため、タプル型として定義します：

```typescript
type TestCase = readonly [
  string,        // テストタイトル
  ...any[]       // テストに必要な引数（対象関数のパラメータに対応）
  expected       // 期待値
];
```

### テストケース配列
`satisfies` を使用して型安全性を保証：

```typescript
const testCases = [
  // 正常系
  ["正常ケース1の説明", 引数1, 引数2, 期待値],
  ["正常ケース2の説明", 引数1, 引数2, 期待値],
  
  // エッジケース
  ["エッジケース1の説明", 引数1, 引数2, 期待値],
  ["エッジケース2の説明", 引数1, 引数2, 期待値],
] satisfies readonly TestCase[];
```

### テストタイトルの命名規則
- 日本語で記述
- 入力値と条件を明確に記載
- 例：
  - `"cookie:en、accept-language:ja,en;q=0.9"`
  - `"cookie:無効、accept-language:無効"`
  - `"想定外のcookie"`

## テストの実装

### test.each パターン
パラメータ化テストには `test.each` を使用：

```typescript
describe("関数名", () => {
  test.each(testCases)("%s", (_, ...args, expected) => {
    expect(targetFunction(...args)).toBe(expected);
  });
});
```

### ポイント
- 第一引数はテストタイトル（`%s` でプレースホルダ）
- `_` でタイトルをスキップし、残りの引数を展開
- 最後の要素を期待値として使用

## テストカテゴリー

### 正常系
- 期待される一般的な使用ケース
- 各種パラメータの組み合わせ

### エッジケース
- 無効な入力値
- 想定外の形式
- 境界値
- 特殊な文字列や数値

## ベストプラクティス

1. **定数の利用**
   - `DEFAULT_LOCALE`、`LOCALES` などの定数を直接使用
   - マジックナンバーを避ける

2. **型安全性**
   - `satisfies` による型チェック
   - タプル型で引数の順序を保証

3. **可読性**
   - テストタイトルで入力と条件を明確に説明
   - テストケースをカテゴリー別にグループ化

4. **保守性**
   - テストケースの追加・削除が容易な配列形式
   - DRYの原則に従い、重複を避ける

## 例：i18n/request.test.ts

```typescript
// 型定義
type TestCase = readonly [
  string,                    // テストタイトル
  string | undefined,        // cookieLocale
  string | null,            // headerAcceptLanguage
  string,                   // expected
];

// テストケース
const testCases = [
  // 正常系：クッキー優先
  ["cookie:en、accept-language:ja,en;q=0.9", "en", "ja,en;q=0.9", "en"],
  
  // エッジケース：無効な値
  ["想定外のcookie", "123", "ja,en;q=0.9", DEFAULT_LOCALE],
] satisfies readonly TestCase[];

// テスト実行
describe("determineLocale", () => {
  test.each(testCases)("%s", (_, cookieLocale, acceptHeader, expected) => {
    expect(determineLocale(cookieLocale, acceptHeader)).toBe(expected);
  });
});
```

## テスト実装後のチェック
- `pnpm tsc --noEmit`でエラーが出ないことを確認
- `pnpm biome check --write`でリントと型チェックを通過することを確認