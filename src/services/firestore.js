import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  increment,
  where,
  getDocs
} from 'firebase/firestore';

// =====================
// ISSUES
// =====================

export const createIssue = async (issueData) => {
  try {
    const docRef = await addDoc(collection(db, 'issues'), {
      ...issueData,
      votes: 1, // Start with 1 vote (from reporter)
      status: 'Pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Listen to all issues (for Admin or global feed)
export const listenToAllIssues = (callback) => {
  const q = query(collection(db, 'issues'));
  return onSnapshot(q, (snapshot) => {
    const issues = [];
    snapshot.forEach(doc => {
      issues.push({ id: doc.id, ...doc.data() });
    });
    // Sort client-side
    issues.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.toMillis?.() || 0;
      return timeB - timeA;
    });
    callback(issues);
  });
};

// Listen to issues by category
export const listenToIssuesByCategory = (category, callback) => {
  const q = query(collection(db, 'issues'), where('category', '==', category));
  return onSnapshot(q, (snapshot) => {
    const issues = [];
    snapshot.forEach(doc => {
      issues.push({ id: doc.id, ...doc.data() });
    });
    // Sort client-side: By votes desc, then createdAt desc
    issues.sort((a, b) => {
      if ((b.votes || 0) !== (a.votes || 0)) {
        return (b.votes || 0) - (a.votes || 0);
      }
      const timeA = a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.toMillis?.() || 0;
      return timeB - timeA;
    });
    callback(issues);
  }, (error) => {
    console.error("Firestore Listen Error:", error);
  });
};

// Upvote an issue
export const upvoteIssue = async (issueId, userId) => {
  try {
    // Basic implementation: increment votes
    // (For robust voting, we'd add to a 'votes' collection to prevent double voting)
    const issueRef = doc(db, 'issues', issueId);
    await updateDoc(issueRef, {
      votes: increment(1)
    });
  } catch (error) {
    throw error;
  }
};

// Admin: Update Status
export const updateIssueStatus = async (issueId, newStatus) => {
  try {
    const issueRef = doc(db, 'issues', issueId);
    await updateDoc(issueRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
    
    // Add notification when resolved
    if (newStatus === 'Resolved') {
      await createNotification(`Issue ${issueId.slice(0, 8)} has been officially resolved!`, 'success', issueId);
    }
  } catch (error) {
    throw error;
  }
};

// Admin: Delete Issue
export const deleteIssue = async (issueId, silently = false) => {
  try {
    await deleteDoc(doc(db, 'issues', issueId));
    if (!silently) {
      await createNotification(`Issue ${issueId.slice(0, 8)} was removed by administrators.`, 'primary', issueId);
    }
  } catch (error) {
    throw error;
  }
};


// =====================
// NOTIFICATIONS
// =====================

export const createNotification = async (message, type = 'info', issueId = null) => {
  try {
    const data = {
      message,
      type,
      read: false,
      createdAt: serverTimestamp()
    };
    if (issueId) data.issueId = issueId;
    
    await addDoc(collection(db, 'notifications'), data);
  } catch (error) {
    console.error('Failed to create notification', error);
  }
};

export const listenToNotifications = (callback) => {
  const q = query(collection(db, 'notifications'));
  return onSnapshot(q, (snapshot) => {
    const notifications = [];
    snapshot.forEach(doc => {
      notifications.push({ id: doc.id, ...doc.data() });
    });
    notifications.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.toMillis?.() || 0;
      return timeB - timeA;
    });
    callback(notifications);
  });
};
