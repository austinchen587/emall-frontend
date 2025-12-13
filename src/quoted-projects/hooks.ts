import { useEffect, useState } from 'react';
import { QuotedProject, QuotedProjectType } from '../services/types/quoted_projects';
import { quotedProjectsApi } from '../services/api_quoted_projects';

export function useQuotedProjects(type: QuotedProjectType) {
  const [data, setData] = useState<QuotedProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    quotedProjectsApi.getProjectsByType(type)
      .then(res => setData(res))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [type]);

  return { data, loading, error };
}
