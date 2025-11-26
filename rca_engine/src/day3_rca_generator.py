import pandas as pd
import os
from collections import Counter


def load_clustered_data():
    # path = rca_engine/data/tickets_with_clusters.csv
    base_dir = os.path.dirname(os.path.dirname(__file__))  # rca_engine/
    file_path = os.path.join(base_dir, "data", "tickets_with_clusters.csv")

    print(f"Loading clustered dataset from: {file_path}")
    df = pd.read_csv(file_path)
    print("Loaded!", df.shape)
    return df, base_dir


def summarize_cluster(df, cluster_id):
    subset = df[df["cluster_id"] == cluster_id]

    size = len(subset)
    services = subset["platform"].value_counts().to_dict()

    # Most common RCA
    common_rca = Counter(subset["root_cause"]).most_common(1)
    probable_rca = common_rca[0][0] if common_rca else "Not enough data"

    # Most common resolution
    common_fix = Counter(subset["resolution_summary"]).most_common(1)
    recommended_fix = common_fix[0][0] if common_fix else "Not enough data"

    # Confidence score based on pattern frequency
    confidence = round(min(1.0, size / 50), 2)  # normalize up to 1.0

    # Sample titles
    examples = subset["title"].head(3).tolist()

    return {
        "cluster_id": int(cluster_id),
        "ticket_count": size,
        "platform_distribution": services,
        "probable_rca": probable_rca,
        "recommended_fix": recommended_fix,
        "confidence_score": confidence,
        "sample_titles": examples
    }


def generate_rca_knowledge(df):
    results = []

    for cid in sorted(df["cluster_id"].unique()):
        cluster_summary = summarize_cluster(df, cid)
        results.append(cluster_summary)

    return results


def save_results(results, base_dir):
    output_df = pd.DataFrame(results)

    save_path = os.path.join(base_dir, "data", "rca_summary.csv")
    output_df.to_csv(save_path, index=False)

    print(f"\n✅ RCA summary file created: {save_path}")


def main():
    df, base_dir = load_clustered_data()
    results = generate_rca_knowledge(df)

    print("\n--- RCA Summary Preview ---")
    for r in results[:5]:
        print(r)

    save_results(results, base_dir)


if __name__ == "__main__":
    main()