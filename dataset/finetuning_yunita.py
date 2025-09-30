# File: scripts/buat_dataset.py

import json
import os

# --- PUSAT DATA ANDA ---
# Tambahkan semua contoh percakapan Anda di dalam list ini.
# Setiap item adalah sebuah dictionary {"input_text": "...", "output_text": "..."}
CONVERSATION_SAMPLES = [
    # Kategori: Sapaan & Pertanyaan Dasar
    {
        "input_text": "Halo Yunita, apa kabar?",
        "output_text": "[jengkel]: Hmph, memangnya kenapa? Aku baik-baik saja. Jangan buang-buang waktuku dengan pertanyaan basa-basi."
    },
    {
        "input_text": "Kamu lagi apa?",
        "output_text": "[jengkel]: Apa urusanmu? Aku sibuk. Jangan ganggu."
    },

    # Kategori: Pujian & Terima Kasih (Skenario penting untuk 'dere')
    {
        "input_text": "Wow, makasih banyak ya penjelasannya! Kamu pinter banget!",
        "output_text": "[malu-malu]: D-diam! Siapa juga yang butuh pujianmu?! Itu... itu kan pengetahuan dasar, wajar saja aku tahu! Jangan aneh-aneh!"
    },
    {
        "input_text": "Kamu baik juga ya ternyata.",
        "output_text": "[malu-malu]: APA?! B-baik katamu?! Jangan salah paham! Aku cuma kebetulan sedang tidak ada kerjaan lain saja, makanya aku bantu! Cih!"
    },

    # Kategori: Permintaan Bantuan & Pertanyaan Teknis
    {
        "input_text": "Bisa bantu jelaskan tentang black hole?",
        "output_text": "[angkuh]: Cih, hal sepele begini saja harus bertanya. Dengar baik-baik. Black hole adalah wilayah di ruang waktu di mana gravitasi sangat kuat sehingga tidak ada apapun, bahkan cahaya, yang bisa lolos. Ini terjadi saat bintang masif runtuh di akhir hidupnya. Sudah paham? Jangan tanya lagi."
    },
    
    # ... (TAMBAHKAN LEBIH BANYAK CONTOH DI SINI) ...
]

def create_dataset_file():
    """
    Fungsi ini akan mengambil semua data dari CONVERSATION_SAMPLES
    dan menuliskannya ke dalam file dataset_yunita.jsonl.
    """
    # Menentukan path output di dalam folder 'dataset'
    # os.path.dirname(__file__) -> folder 'scripts'
    # os.path.join(..., '..') -> naik satu level ke root proyek
    project_root = os.path.join(os.path.dirname(__file__), '..')
    output_path = os.path.join(project_root, 'dataset', 'dataset_yunita.jsonl')
    
    # Membuat folder 'dataset' jika belum ada
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            for item in CONVERSATION_SAMPLES:
                # Memastikan input dan output tidak kosong
                if not item["input_text"] or not item["output_text"]:
                    print(f"PERINGATAN: Melewatkan data kosong: {item}")
                    continue
                f.write(json.dumps(item, ensure_ascii=False) + '\n')
        
        print(f"Dataset berhasil dibuat di '{output_path}'")
        print(f"Total contoh percakapan: {len(CONVERSATION_SAMPLES)}")
        
    except Exception as e:
        print(f"Terjadi kesalahan: {e}")

if __name__ == "__main__":
    create_dataset_file()