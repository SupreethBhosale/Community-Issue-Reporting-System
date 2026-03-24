import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadImage = async (file, folder = 'issues') => {
  if (!file) return null;
  
  try {
    // Create a unique filename
    const filename = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${folder}/${filename}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image', error);
    throw error;
  }
};
