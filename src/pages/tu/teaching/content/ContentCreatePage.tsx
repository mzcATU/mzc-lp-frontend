import { useNavigate } from 'react-router-dom';
import { ContentRegistrationWizard } from '@/components/domain/tu/content';
import type { LOData } from '@/types';
import { useUploadContent, useCreateExternalLink } from '@/hooks/tu';

export function ContentCreatePage() {
  const navigate = useNavigate();
  const uploadContent = useUploadContent();
  const createExternalLink = useCreateExternalLink();

  const handleBack = () => {
    navigate('/tu/teaching/content');
  };

  const handleSave = async (data: LOData) => {
    try {
      if (data.loType === 'external-link' && data.externalUrl) {
        // 외부 링크 생성
        await createExternalLink.mutateAsync({
          url: data.externalUrl,
          name: data.title, // 콘텐츠 제목을 name으로 사용
        });
      } else if (data.uploadedFile) {
        // 파일 업로드 (제목, 설명, 태그, 썸네일 전달)
        await uploadContent.mutateAsync({
          file: data.uploadedFile,
          originalFileName: data.title && data.title !== data.uploadedFile.name ? data.title : undefined,
          description: data.description || undefined,
          tags: data.tags.length > 0 ? data.tags.join(',') : undefined,
          thumbnail: data.thumbnailImage,
        });
      }

      alert('콘텐츠가 등록되었습니다.');
      navigate('/tu/teaching/content');
    } catch (error) {
      console.error('콘텐츠 등록 실패:', error);
      alert('콘텐츠 등록에 실패했습니다.');
    }
  };

  return <ContentRegistrationWizard onBack={handleBack} onSave={handleSave} />;
}
