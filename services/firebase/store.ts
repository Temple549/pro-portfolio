import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  Timestamp,
  DocumentData,
  FirestoreError,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import {
  // ... existing imports
  setDoc, // ADD THIS
} from 'firebase/firestore';

// Also add AboutData and AboutInput to the imports from types at the bottom
import { BlogPost, BlogPostInput, Experience, ExperienceInput, ContactEntry, AboutData, AboutInput } from '@/types/content';
import { db } from './config';
import { COLLECTIONS, QueryOptions } from '@/types/content';


// ============================================
// HELPER FUNCTIONS
// ============================================

const buildQueryConstraints = (options?: QueryOptions): QueryConstraint[] => {
  const constraints: QueryConstraint[] = [];

  if (options?.filters) {
    for (const filter of options.filters) {
      constraints.push(where(filter.field, filter.operator, filter.value));
    }
  }

  if (options?.orderBy) {
    constraints.push(orderBy(options.orderBy.field, options.orderBy.direction));
  }

  if (options?.limit) {
    constraints.push(limit(options.limit));
  }

  return constraints;
};

const serializeForFirestore = (data: DocumentData): DocumentData => {
  const serialized: DocumentData = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Date) {
      serialized[key] = Timestamp.fromDate(value);
    } else {
      serialized[key] = value;
    }
  }
  return serialized;
};

const deserializeFromFirestore = (data: DocumentData): DocumentData => {
  const deserialized: DocumentData = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Timestamp) {
      deserialized[key] = value.toDate();
    } else {
      deserialized[key] = value;
    }
  }
  return deserialized;
};

// ============================================
// GENERIC FIRESTORE SERVICE
// ============================================

export const firestoreService = {
  async create<T extends DocumentData>(collectionName: string, data: T): Promise<string> {
    try {
      const now = new Date();
      const payload = {
        ...serializeForFirestore(data),
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
      };
      const docRef = await addDoc(collection(db, collectionName), payload);
      return docRef.id;
    } catch (error: unknown) {
      const firestoreError = error as FirestoreError;
      console.error(`Firestore Create Error [${collectionName}]:`, firestoreError);
      throw new Error(`Failed to create document: ${firestoreError.message}`);
    }
  },

  async update<T extends DocumentData>(collectionName: string, docId: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      const payload = {
        ...serializeForFirestore(data),
        updatedAt: Timestamp.fromDate(new Date()),
      };
      await updateDoc(docRef, payload);
    } catch (error: unknown) {
      const firestoreError = error as FirestoreError;
      console.error(`Firestore Update Error [${collectionName}/${docId}]:`, firestoreError);
      throw new Error(`Failed to update document: ${firestoreError.message}`);
    }
  },

  async delete(collectionName: string, docId: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error: unknown) {
      const firestoreError = error as FirestoreError;
      console.error(`Firestore Delete Error [${collectionName}/${docId}]:`, firestoreError);
      throw new Error(`Failed to delete document: ${firestoreError.message}`);
    }
  },

  async getById<T>(collectionName: string, docId: string): Promise<(T & { id: string }) | null> {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return {
        id: docSnap.id,
        ...deserializeFromFirestore(docSnap.data()),
      } as T & { id: string };
    } catch (error: unknown) {
      const firestoreError = error as FirestoreError;
      console.error(`Firestore GetById Error [${collectionName}/${docId}]:`, firestoreError);
      throw new Error(`Failed to fetch document: ${firestoreError.message}`);
    }
  },

  async getAll<T>(collectionName: string, options?: QueryOptions): Promise<(T & { id: string })[]> {
    try {
      const constraints = buildQueryConstraints(options);
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...deserializeFromFirestore(doc.data()),
      })) as (T & { id: string })[];
    } catch (error: unknown) {
      const firestoreError = error as FirestoreError;
      console.error(`Firestore GetAll Error [${collectionName}]:`, firestoreError);
      throw new Error(`Failed to fetch documents: ${firestoreError.message}`);
    }
  },

  subscribe<T>(collectionName: string, callback: (documents: (T & { id: string })[]) => void, options?: QueryOptions): Unsubscribe {
    const constraints = buildQueryConstraints(options);
    const q = query(collection(db, collectionName), ...constraints);
    return onSnapshot(
      q,
      (querySnapshot) => {
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...deserializeFromFirestore(doc.data()),
        })) as (T & { id: string })[];
        callback(documents);
      },
      (error) => {
        console.error(`Firestore Subscribe Error [${collectionName}]:`, error);
        callback([]);
      }
    );
  },
};

// ============================================
// BLOG SERVICE (Index-Free)
// ============================================

export const blogService = {
  async create(data: BlogPostInput): Promise<string> {
    return firestoreService.create<BlogPostInput>(COLLECTIONS.BLOG_POSTS, data);
  },

  async update(id: string, data: Partial<BlogPostInput>): Promise<void> {
    return firestoreService.update<BlogPostInput>(COLLECTIONS.BLOG_POSTS, id, data);
  },

  async delete(id: string): Promise<void> {
    return firestoreService.delete(COLLECTIONS.BLOG_POSTS, id);
  },

  async getById(id: string): Promise<(BlogPost & { id: string }) | null> {
    return firestoreService.getById<BlogPost>(COLLECTIONS.BLOG_POSTS, id);
  },

  async getAll(): Promise<(BlogPost & { id: string })[]> {
    return firestoreService.getAll<BlogPost>(COLLECTIONS.BLOG_POSTS, {
      orderBy: { field: 'createdAt', direction: 'desc' },
    });
  },

  async getPublished(): Promise<(BlogPost & { id: string })[]> {
    const allPosts = await this.getAll();
    return allPosts.filter((post) => post.published === true);
  },

  async getBySlug(slug: string): Promise<(BlogPost & { id: string }) | null> {
    const allPosts = await this.getAll();
    return allPosts.find((post) => post.slug === slug) || null;
  },

  subscribe(callback: (documents: (BlogPost & { id: string })[]) => void): Unsubscribe {
    return firestoreService.subscribe<BlogPost>(COLLECTIONS.BLOG_POSTS, callback, {
      orderBy: { field: 'createdAt', direction: 'desc' },
    });
  },
};

// ============================================
// EXPERIENCE SERVICE
// ============================================

export const experienceService = {
  async create(data: ExperienceInput): Promise<string> {
    return firestoreService.create<ExperienceInput>(COLLECTIONS.EXPERIENCES, data);
  },

  async update(id: string, data: Partial<ExperienceInput>): Promise<void> {
    return firestoreService.update<ExperienceInput>(COLLECTIONS.EXPERIENCES, id, data);
  },

  async delete(id: string): Promise<void> {
    return firestoreService.delete(COLLECTIONS.EXPERIENCES, id);
  },

  async getAll(): Promise<(Experience & { id: string })[]> {
    return firestoreService.getAll<Experience>(COLLECTIONS.EXPERIENCES, {
      orderBy: { field: 'order', direction: 'asc' },
    });
  },

  subscribe(callback: (documents: (Experience & { id: string })[]) => void): Unsubscribe {
    return firestoreService.subscribe<Experience>(COLLECTIONS.EXPERIENCES, callback, {
      orderBy: { field: 'order', direction: 'asc' },
    });
  },
};

// ============================================
// CONTACT SERVICE (Index-Free)
// ============================================

export const contactService = {
  async create(data: Omit<ContactEntry, 'id' | 'read' | 'archived' | 'createdAt'>): Promise<string> {
    return firestoreService.create(COLLECTIONS.CONTACT_ENTRIES, {
      ...data,
      read: false,
      archived: false,
    });
  },

  async update(id: string, data: Partial<Pick<ContactEntry, 'read' | 'archived'>>): Promise<void> {
    return firestoreService.update(COLLECTIONS.CONTACT_ENTRIES, id, data);
  },

  async delete(id: string): Promise<void> {
    return firestoreService.delete(COLLECTIONS.CONTACT_ENTRIES, id);
  },

  async getAll(): Promise<(ContactEntry & { id: string })[]> {
    return firestoreService.getAll<ContactEntry>(COLLECTIONS.CONTACT_ENTRIES, {
      orderBy: { field: 'createdAt', direction: 'desc' },
    });
  },

  async getUnread(): Promise<(ContactEntry & { id: string })[]> {
    const all = await this.getAll();
    return all.filter((entry) => !entry.read && !entry.archived);
  },

  async markAsRead(id: string): Promise<void> {
    return this.update(id, { read: true });
  },

  async archive(id: string): Promise<void> {
    return this.update(id, { archived: true });
  },

  subscribe(callback: (documents: (ContactEntry & { id: string })[]) => void): Unsubscribe {
    return firestoreService.subscribe<ContactEntry>(COLLECTIONS.CONTACT_ENTRIES, callback, {
      orderBy: { field: 'createdAt', direction: 'desc' },
    });
  },
};

// ============================================
// ABOUT SERVICE (Single Document)
// ============================================

const ABOUT_DOC_ID = 'main';

export const aboutService = {
  async get(): Promise<(AboutData & { id: string }) | null> {
    try {
      return await firestoreService.getById<AboutData>(COLLECTIONS.CONTACT_ENTRIES.replace('contact_entries', 'site_settings'), ABOUT_DOC_ID);
    } catch (error) {
      // If the document doesn't exist yet, return null gracefully
      return null;
    }
  },

  async upsert(data: AboutInput): Promise<void> {
    try {
      const collectionName = 'site_settings';
      const docRef = doc(db, collectionName, ABOUT_DOC_ID);
      const payload = {
        ...serializeForFirestore(data),
        updatedAt: Timestamp.fromDate(new Date()),
      };

      // Check if document exists, if not create it, if yes update it
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, payload);
      } else {
        await setDoc(docRef, {
          ...payload,
          createdAt: Timestamp.fromDate(new Date()),
        });
      }
    } catch (error: any) {
      console.error('About Service Error:', error);
      throw new Error(`Failed to save about data: ${error.message}`);
    }
  }
};