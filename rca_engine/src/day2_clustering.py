import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
import joblib
import os


def load_data():
    # Build path to CSV relative to this file
    base_dir = os.path.dirname(os.path.dirname(__file__))  # rca_engine/
    data_path = os.path.join(base_dir, "data", "multi_platform_ticket_dataset.csv")

    print(f"Loading data from: {data_path}")
    df = pd.read_csv(data_path)
    print("Data loaded. Shape:", df.shape)
    return df, base_dir


def preprocess(df: pd.DataFrame) -> pd.DataFrame:
    # Create combined text field
    df["full_text"] = (
        df["platform"].astype(str) + " - " +
        df["title"].astype(str) + " " +
        df["description"].astype(str)
    )

    # Lowercase
    df["full_text_clean"] = df["full_text"].str.lower()

    print("Sample full_text_clean:")
    print(df["full_text_clean"].head())
    return df


def vectorize_text(df: pd.DataFrame):
    print("\nVectorizing text with TF-IDF...")
    vectorizer = TfidfVectorizer(
        max_features=3000,
        stop_words="english"
    )
    X = vectorizer.fit_transform(df["full_text_clean"])
    print("TF-IDF matrix shape:", X.shape)
    return X, vectorizer


def cluster_tickets(X, df: pd.DataFrame, k: int = 20):
    print(f"\nClustering into {k} clusters using KMeans...")
    kmeans = KMeans(
        n_clusters=k,
        random_state=42,
        n_init=10
    )
    df["cluster_id"] = kmeans.fit_predict(X)
    print("Clustering complete.")
    return df, kmeans


def show_cluster_summary(df: pd.DataFrame, num_clusters_to_show: int = 5):
    print("\nCluster sizes:")
    print(df["cluster_id"].value_counts().sort_index())

    def show_cluster_examples(cluster_id, n_examples=5):
        subset = df[df["cluster_id"] == cluster_id]
        print(f"\n=== Cluster {cluster_id} | {len(subset)} tickets ===")
        print("Platforms:", subset["platform"].value_counts().to_dict())
        print("\nSample titles:\n")
        for _, row in subset.head(n_examples).iterrows():
            print(f"- [{row['platform']}] {row['title']}")

    for cid in range(num_clusters_to_show):
        show_cluster_examples(cid)


def save_outputs(df: pd.DataFrame, vectorizer, kmeans, base_dir: str):
    models_dir = os.path.join(base_dir, "models")
    data_dir = os.path.join(base_dir, "data")
    os.makedirs(models_dir, exist_ok=True)

    vectorizer_path = os.path.join(models_dir, "tfidf_vectorizer.pkl")
    kmeans_path = os.path.join(models_dir, "kmeans_model.pkl")
    clustered_csv_path = os.path.join(data_dir, "tickets_with_clusters.csv")

    print(f"\nSaving vectorizer to: {vectorizer_path}")
    joblib.dump(vectorizer, vectorizer_path)

    print(f"Saving kmeans model to: {kmeans_path}")
    joblib.dump(kmeans, kmeans_path)

    print(f"Saving clustered dataset to: {clustered_csv_path}")
    df.to_csv(clustered_csv_path, index=False)

    print("\nAll outputs saved successfully.")


def main():
    df, base_dir = load_data()
    df = preprocess(df)
    X, vectorizer = vectorize_text(df)
    df, kmeans = cluster_tickets(X, df, k=20)
    show_cluster_summary(df, num_clusters_to_show=5)
    save_outputs(df, vectorizer, kmeans, base_dir)


if __name__ == "__main__":
    main()
