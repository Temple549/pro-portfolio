"use client";

import { useState, useEffect, useCallback } from 'react';
import { blogService, experienceService, contactService } from '@/services/firebase/store';
import { BlogPost, Experience, ContactEntry } from '@/types/content';

// ============================================
// GENERIC SUBSCRIPTION HOOK PATTERN
// ============================================

interface UseCollectionState<T> {
  data: (T & { id: string })[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ============================================
// BLOG POSTS HOOK
// ============================================

export function useBlogPosts(): UseCollectionState<BlogPost> {
  const [data, setData] = useState<(BlogPost & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInitial = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const posts = await blogService.getAll();
      setData(posts);
    } catch (err: any) {
      setError(err.message || "Failed to fetch blog posts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitial();

    const unsubscribe = blogService.subscribe((updatedPosts) => {
      setData(updatedPosts);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [fetchInitial]);

  return { data, isLoading, error, refetch: fetchInitial };
}

// ============================================
// EXPERIENCES HOOK
// ============================================

export function useExperiences(): UseCollectionState<Experience> {
  const [data, setData] = useState<(Experience & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInitial = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const experiences = await experienceService.getAll();
      setData(experiences);
    } catch (err: any) {
      setError(err.message || "Failed to fetch experiences");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitial();

    const unsubscribe = experienceService.subscribe((updatedExperiences) => {
      setData(updatedExperiences);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [fetchInitial]);

  return { data, isLoading, error, refetch: fetchInitial };
}

// ============================================
// CONTACT ENTRIES HOOK
// ============================================

export function useContactEntries(): UseCollectionState<ContactEntry> {
  const [data, setData] = useState<(ContactEntry & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInitial = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const entries = await contactService.getAll();
      setData(entries);
    } catch (err: any) {
      setError(err.message || "Failed to fetch contact entries");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitial();

    const unsubscribe = contactService.subscribe((updatedEntries) => {
      setData(updatedEntries);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [fetchInitial]);

  return { data, isLoading, error, refetch: fetchInitial };
}

// ============================================
// SINGLE DOCUMENT HOOK
// ============================================

interface UseDocumentState<T> {
  data: (T & { id: string }) | null;
  isLoading: boolean;
  error: string | null;
}

export function useBlogPost(postId: string | null): UseDocumentState<BlogPost> {
  const [data, setData] = useState<(BlogPost & { id: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setData(null);
      setIsLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const post = await blogService.getById(postId);
        setData(post);
      } catch (err: any) {
        setError(err.message || "Failed to fetch blog post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return { data, isLoading, error };
}