import { Youtube, Instagram } from 'lucide-react';
import { useTranslation } from '@/store/common/languageStore';
import { useTenantBranding } from '@/contexts/TenantBrandingContext';
import { usePublicLayout } from '@/hooks/tu';

export function LandingFooter() {
  const { t } = useTranslation();
  const { branding } = useTenantBranding();
  const { data: layoutData } = usePublicLayout();
  const tenantName = branding?.tenantName || 'MEGAZONECLOUD';

  // 푸터 설정
  const footerSettings = layoutData?.footerSettings;
  const rawSocialLinks = footerSettings?.socialLinks as Record<string, { enabled?: boolean; url?: string } | string> | undefined;

  // socialLinks 구조 통일 (TA에서 { enabled, url } 형식으로 저장)
  const socialLinks = rawSocialLinks ? {
    twitter: typeof rawSocialLinks.twitter === 'object' && rawSocialLinks.twitter?.enabled ? rawSocialLinks.twitter.url : (typeof rawSocialLinks.twitter === 'string' ? rawSocialLinks.twitter : undefined),
    youtube: typeof rawSocialLinks.youtube === 'object' && rawSocialLinks.youtube?.enabled ? rawSocialLinks.youtube.url : (typeof rawSocialLinks.youtube === 'string' ? rawSocialLinks.youtube : undefined),
    instagram: typeof rawSocialLinks.instagram === 'object' && rawSocialLinks.instagram?.enabled ? rawSocialLinks.instagram.url : (typeof rawSocialLinks.instagram === 'string' ? rawSocialLinks.instagram : undefined),
    linkedin: typeof rawSocialLinks.linkedin === 'object' && rawSocialLinks.linkedin?.enabled ? rawSocialLinks.linkedin.url : (typeof rawSocialLinks.linkedin === 'string' ? rawSocialLinks.linkedin : undefined),
    facebook: typeof rawSocialLinks.facebook === 'object' && rawSocialLinks.facebook?.enabled ? rawSocialLinks.facebook.url : (typeof rawSocialLinks.facebook === 'string' ? rawSocialLinks.facebook : undefined),
  } : undefined;

  // 회사 정보
  const companyInfo = footerSettings?.companyInfo as { ceo?: string; businessNo?: string; address?: string; phone?: string } | undefined;

  // 법적 링크
  const legalLinks = footerSettings?.legalLinks as { label: string; url: string }[] | undefined;

  // 저작권 정보
  const copyright = footerSettings?.copyright as string | undefined;

  // 푸터가 비활성화되어 있으면 렌더링하지 않음
  if (footerSettings?.enabled === false) {
    return null;
  }

  return (
    <footer className="landing-footer-wrapper landing-text-secondary text-sm py-16">
      <div className="w-full px-6 md:px-12 lg:px-16">
        {/* Middle Section - Company Info */}
        <div className="landing-border-top pt-8 pb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold gradient-text">{tenantName}</span>
              </div>
              <div className="text-[12px] landing-text-muted leading-relaxed space-y-1">
                <p>{tenantName} | 대표: {companyInfo?.ceo || t.footer.ceo}</p>
                <p>사업자등록번호: {companyInfo?.businessNo || t.footer.businessNo}</p>
                <p>{companyInfo?.address || t.footer.address}</p>
                <p>대표전화: {companyInfo?.phone || t.footer.phone}</p>
              </div>
            </div>

            {/* Social Links */}
            {footerSettings?.showSocialLinks !== false && (
              <div className="flex items-center gap-4">
                {/* Twitter/X */}
                {socialLinks?.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full landing-social-btn transition-colors"
                    aria-label="X (Twitter)"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
                {/* YouTube */}
                {socialLinks?.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full landing-social-btn transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
                {/* Instagram */}
                {socialLinks?.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full landing-social-btn transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {/* LinkedIn */}
                {socialLinks?.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full landing-social-btn transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                )}
                {/* Facebook */}
                {socialLinks?.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full landing-social-btn transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {/* 소셜 링크가 설정되지 않은 경우 기본 아이콘 표시 */}
                {!socialLinks && (
                  <>
                    <a href="#" className="p-3 rounded-full landing-social-btn transition-colors" aria-label="X (Twitter)">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a href="#" className="p-3 rounded-full landing-social-btn transition-colors" aria-label="YouTube">
                      <Youtube className="w-5 h-5" />
                    </a>
                    <a href="#" className="p-3 rounded-full landing-social-btn transition-colors" aria-label="Instagram">
                      <Instagram className="w-5 h-5" />
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section - Legal */}
        <div className="landing-border-top pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-6 text-[12px] landing-text-muted">
            {legalLinks && legalLinks.length > 0 ? (
              legalLinks.map((link, index) => (
                <a key={index} href={link.url || '#'} className="landing-link-hover transition-colors">
                  {link.label}
                </a>
              ))
            ) : (
              <>
                <a href="/privacy" className="landing-link-hover transition-colors">
                  {t.footer.privacyPolicy}
                </a>
                <a href="/terms" className="landing-link-hover transition-colors">
                  {t.footer.terms}
                </a>
                <a href="/email-policy" className="landing-link-hover transition-colors">
                  {t.footer.emailPolicy}
                </a>
              </>
            )}
          </div>
          {footerSettings?.showCopyright !== false && (
            <p className="text-[12px] landing-text-muted">
              {copyright || `© ${new Date().getFullYear()} ${tenantName}. All rights reserved.`}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
