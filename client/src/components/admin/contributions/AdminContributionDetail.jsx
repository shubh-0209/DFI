import SimpleLoader from '../../common/SimpleLoader';
import React from 'react';
import {} from 'lucide-react';
import { useAdminContributionDetail } from '../../../hooks/useAdminContributions';
import VolunteerInfoCard from './VolunteerInfoCard';
import ContributionInfoCard from './ContributionInfoCard';
import ContributionFiles from './ContributionFiles';
import ReviewHistory from '../../contributions/ReviewHistory';
import VersionHistory from '../../contributions/VersionHistory';
import ActivityTimeline from './ActivityTimeline';

const AdminContributionDetail = ({ contributionId, onBack }) => {
  const { data, isLoading, error } = useAdminContributionDetail(contributionId);

  if (!contributionId) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <SimpleLoader />
      </div>
    );
  }

  if (error || !data?.contribution) {
    return (
      <div className="text-center p-8 text-red-600 bg-red-50 rounded-xl">
        <p className="text-base mb-4 font-medium">Failed to load contribution details.</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">
          Retry
        </button>
      </div>
    );
  }

  const contribution = data.contribution;
  const currentVersion = contribution.currentVersion || contribution.versions?.[0] || {};
  const files = currentVersion.files || [];
  const links = {
    githubUrl: currentVersion.githubUrl,
    figmaUrl: currentVersion.figmaUrl,
    canvaUrl: currentVersion.canvaUrl,
    googleDriveUrl: currentVersion.googleDriveUrl,
  };

  return (
    <div className="flex flex-col gap-6">
      <VolunteerInfoCard volunteer={contribution.submittedBy} />
      <ContributionInfoCard contribution={contribution} />
      
      {(files.length > 0 || Object.values(links).some(v => v)) && (
        <ContributionFiles files={files} links={links} />
      )}

      <div className="flex flex-col gap-6 mt-4">
        <ActivityTimeline currentStatus={contribution.status} reviews={data.reviews || []} />
        {contribution.versions?.length > 1 && <VersionHistory versions={contribution.versions} />}
      </div>
    </div>
  );
};

export default AdminContributionDetail;
