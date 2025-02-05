import faiss
import pickle
import numpy as np
import os

FAISS_INDEX_PATH = "/mnt/data/index.faiss"
METADATA_PATH = "/mnt/data/index.pkl"

class FAISSManager:
    def __init__(self):
        self.index = self._load_faiss_index()
        self.metadata = self._load_metadata()

    def _load_faiss_index(self):
        if os.path.exists(FAISS_INDEX_PATH):
            print(f"Loading FAISS index from {FAISS_INDEX_PATH}")
            return faiss.read_index(FAISS_INDEX_PATH)
        else:
            raise FileNotFoundError(f"FAISS index not found at {FAISS_INDEX_PATH}")

    def _load_metadata(self):
        if os.path.exists(METADATA_PATH):
            print(f"Loading metadata from {METADATA_PATH}")
            with open(METADATA_PATH, "rb") as f:
                return pickle.load(f)
        else:
            raise FileNotFoundError(f"Metadata not found at {METADATA_PATH}")

    def search(self, query_vector, k=5):
        query_vector = np.array(query_vector).reshape(1, -1).astype("float32")
        distances, indices = self.index.search(query_vector, k)
        results = [{"distance": d, "metadata": self.metadata[i]} for d, i in zip(distances[0], indices[0])]
        return results