// ═══════════════════════════════════════════════════════
//  ADFENESA — Configuración Firebase
//  Reemplaza los valores con los de tu proyecto en
//  https://console.firebase.google.com
// ═══════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════
//  ADFENESA — Configuración Firebase
// ═══════════════════════════════════════════════════════

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage }    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey:            "AIzaSyCZPl84R2Ciro66lVqtWNf15eLVLJ_MuAM",
  authDomain:        "adfenesa.firebaseapp.com",
  projectId:         "adfenesa",
  storageBucket:     "adfenesa.firebasestorage.app",
  messagingSenderId: "25019401094",
  appId:             "1:25019401094:web:88773517b7865391b36207"
};

const app = initializeApp(firebaseConfig);

export const db      = getFirestore(app);
export const storage = getStorage(app);
export const auth    = getAuth(app);