import React, { createContext, useContext, useMemo, useState } from 'react';

export type Language = 'ko' | 'en';

type Dictionary = Record<string, string | Dictionary>;

type I18nContextValue = {
  lang: Language;
  t: (key: string) => string;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const dictionary: Record<Language, Dictionary> = {
  ko: {
    nav: {
      browse: '탐색',
      collections: '컬렉션',
      about: '소개',
      upload: '업로드',
      search: '검색',
      language: '언어',
    },
    footer: {
      description:
        '잊혀진 미디어를 보존하고 발굴하는 분산형 아카이브입니다.\nIPFS를 통해 검열에 강하고 영구적인 미디어 저장소를 제공합니다.',
      explore: '탐색',
      info: '정보',
      about: '소개',
      uploadGuide: '업로드 가이드',
      whatIsIpfs: 'IPFS란?',
      madeWith: '디지털 역사를 보존하기 위해 만들었습니다',
      video: '영상',
      image: '이미지',
      audio: '오디오',
      collections: '컬렉션',
    },
    common: {
      viewAll: '전체보기',
      loading: '로딩 중...',
      errorTitle: '오류가 발생했습니다',
      errorMessage: '요청을 처리하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
      retry: '다시 시도',
      emptyTitle: '콘텐츠가 없습니다',
      emptyMessage: '아직 등록된 미디어가 없습니다.',
      upload: '업로드하기',
      share: '공유',
      backToList: '목록으로',
      searchPlaceholder: '제목, 설명, 태그로 검색...',
      search: '검색',
      clear: '초기화',
      previous: '이전',
      next: '다음',
      filters: '필터',
      sort: '정렬',
    },
    home: {
      badge: 'IPFS 기반 분산 저장소',
      title1: '잊혀진 미디어를',
      title2: '영원히 보존합니다',
      subtitle:
        'Lost Media Archive는 사라진 영상, 이미지, 오디오를\n분산 네트워크에 영구적으로 보존하는 아카이브입니다.',
      explore: '아카이브 탐색',
      contribute: '미디어 기여하기',
      statsTotal: '총 미디어',
      statsViews: '총 조회수',
      statsVideo: '영상',
      statsImage: '이미지',
      whyTitle: '왜 Lost Media Archive인가?',
      whySubtitle:
        '기존 플랫폼과 달리 분산 저장 방식으로 검열에 강하고 영구적인 보존이 가능합니다.',
      features: {
        distributed: {
          title: '분산 저장',
          desc: 'IPFS 네트워크를 통해 전 세계에 분산 저장되어 단일 장애점이 없습니다.',
        },
        censorship: {
          title: '검열 저항',
          desc: '중앙 서버가 없어 특정 주체에 의한 삭제나 검열이 불가능합니다.',
        },
        privacy: {
          title: '개인정보 보호',
          desc: 'CID를 숨기고 내부 ID만 노출하여 콘텐츠 추적을 방지합니다.',
        },
      },
      popular: '인기 콘텐츠',
      recent: '최근 추가',
      noMedia: '아직 등록된 미디어가 없습니다.',
      uploadFirst: '첫 번째 미디어 업로드하기',
      categoryTitle: '카테고리별 탐색',
      categorySubtitle: '원하는 미디어 유형을 선택하여 탐색하세요.',
      categoryCount: '개의 파일',
      ctaTitle: '잊혀진 미디어를 발견하셨나요?',
      ctaSubtitle:
        '소중한 미디어를 아카이브에 기여해주세요.\n당신의 기여가 디지털 역사를 보존합니다.',
      ctaButton: '미디어 업로드하기',
    },
    browse: {
      title: '아카이브 탐색',
      total: '개의 미디어가 보관되어 있습니다.',
      loadErrorTitle: '미디어 로드 실패',
      loadErrorMessage: '미디어 목록을 불러오는 데 실패했습니다.',
      all: '전체',
      video: '영상',
      image: '이미지',
      audio: '오디오',
      document: '문서',
      sortByDate: '등록일순',
      sortByViews: '조회수순',
      sortByTitle: '제목순',
      noResultsTitle: '검색 결과가 없습니다',
      noResultsMessage: '해당 조건에 맞는 미디어가 없습니다.',
      noResultsSearch: '에 대한 검색 결과가 없습니다.',
      resetFilters: '필터 초기화',
      searchLabel: '검색어:',
      grid: '그리드',
      list: '리스트',
      ascending: '오름차순',
      descending: '내림차순',
    },
    upload: {
      title: '미디어 업로드',
      subtitle:
        '잊혀진 미디어를 IPFS에 영구적으로 보존하세요.\n파일은 서버에 저장되지 않고 직접 IPFS로 전송됩니다.',
      drop: '파일을 드래그하거나 클릭하여 선택',
      dropActive: '파일을 여기에 놓으세요',
      fileTypes: '영상, 이미지, 오디오, PDF (최대 500MB)',
      fields: {
        title: '제목',
        description: '설명',
        tags: '태그',
        source: '출처 정보',
        lostDate: '유실 추정일',
        foundDate: '발견일',
      },
      placeholders: {
        title: '미디어 제목을 입력하세요',
        description: '미디어에 대한 설명을 입력하세요',
        tags: '태그를 쉼표로 구분하여 입력 (예: 광고, 90년대, TV)',
        source: '원본 출처나 관련 정보를 입력하세요',
      },
      upload: 'IPFS에 업로드',
      uploading: '업로드 중...',
      successTitle: '업로드 완료!',
      successMessage: '미디어가 성공적으로 IPFS에 업로드되었습니다.',
      successHint: '잠시 후 미디어 페이지로 이동합니다...',
      infoTitle: '📌 안내사항',
      info1: '파일은 서버 디스크에 저장되지 않고 직접 IPFS로 스트리밍됩니다.',
      info2: '업로드된 콘텐츠는 분산 네트워크에 영구적으로 저장됩니다.',
      info3: 'CID(콘텐츠 주소)는 외부에 노출되지 않습니다.',
      errorFallback: '업로드 중 오류가 발생했습니다. IPFS 데몬이 실행 중인지 확인해주세요.',
      maxSizeError: '파일 크기는 500MB를 초과할 수 없습니다.',
    },
    view: {
      notFoundTitle: '미디어를 찾을 수 없습니다',
      notFoundMessage: '요청하신 미디어가 존재하지 않거나 접근이 제한되었습니다.',
      description: '설명',
      info: '미디어 정보',
      type: '유형',
      size: '파일 크기',
      mime: 'MIME 타입',
      createdAt: '등록일',
      lostDate: '유실 추정일',
      foundDate: '발견일',
      sourceInfo: '출처 정보',
      tags: '태그',
      distributed: '🔐 분산 저장',
      distributedText:
        '이 콘텐츠는 IPFS 네트워크에 분산 저장되어 있습니다.\nCID(콘텐츠 주소)는 보안을 위해 공개되지 않습니다.',
      documentPreview: '문서 미리보기를 지원하지 않습니다.',
      openDocument: '문서 열기',
      views: '조회수',
    },
    search: {
      title: '검색',
      subtitle: '잊혀진 미디어를 찾아보세요.',
      placeholder: '제목, 태그, 설명으로 검색...',
      popularTags: '인기 태그',
      tipsTitle: '💡 검색 팁',
      tips: '정확한 제목을 모르면 기억나는 키워드로 검색해보세요.||연도나 시대를 함께 검색하면 더 정확한 결과를 얻을 수 있습니다.||탐색 페이지에서 미디어 유형별로 필터링할 수 있습니다.',
    },
    about: {
      title: 'Lost Media Archive',
      subtitle: '잊혀진 미디어를 영원히 보존하는\n분산형 아카이브 프로젝트입니다.',
      missionTitle: '📌 미션',
      missionBody:
        '디지털 시대에 수많은 미디어가 생성되고 사라집니다.\nTV 광고, 방송 프로그램, 뮤직비디오, 온라인 콘텐츠 등\n한때 존재했지만 더 이상 접근할 수 없는 "로스트 미디어"는\n문화적, 역사적 가치를 지닙니다.\n\nLost Media Archive는 이러한 미디어를 분산 저장 기술을 활용하여\n영구적으로 보존하고, 누구나 접근할 수 있도록 공개하는 것을 목표로 합니다.',
      howTitle: '🔧 작동 방식',
      howItems: {
        ipfs: {
          title: 'IPFS 저장',
          desc: '모든 미디어는 InterPlanetary File System(IPFS)에 저장됩니다. 콘텐츠 기반 주소 지정을 통해 데이터 무결성이 보장됩니다.',
        },
        cid: {
          title: 'CID 보호',
          desc: 'IPFS 콘텐츠 식별자(CID)는 외부에 노출되지 않습니다. 내부 ID 매핑을 통해 프라이버시를 보호합니다.',
        },
        stream: {
          title: '직접 스트리밍',
          desc: '업로드 시 파일이 서버에 저장되지 않고 직접 IPFS로 스트리밍됩니다. 서버는 파이프 역할만 수행합니다.',
        },
        distributed: {
          title: '분산 네트워크',
          desc: 'IPFS 네트워크의 여러 노드에 복제되어 단일 장애점 없이 안정적으로 서비스됩니다.',
        },
      },
      featuresTitle: '✨ 특징',
      features: {
        censorship: {
          title: '검열 저항',
          desc: '중앙 서버가 없어 특정 주체에 의한 임의 삭제가 불가능합니다.',
        },
        permanent: {
          title: '영구 보존',
          desc: '한번 업로드된 콘텐츠는 네트워크가 존재하는 한 영구적으로 보존됩니다.',
        },
        open: {
          title: '오픈 아카이브',
          desc: '누구나 미디어를 기여하고 열람할 수 있는 개방형 아카이브입니다.',
        },
      },
      stackTitle: '🛠️ 기술 스택',
      stackFrontend: 'Frontend',
      stackBackend: 'Backend',
      disclaimerTitle: '⚠️ 주의사항',
      disclaimer: '저작권을 침해하는 콘텐츠의 업로드는 금지됩니다.||본 아카이브는 문화적, 역사적 보존을 목적으로 합니다.||업로드된 콘텐츠에 대한 책임은 업로더에게 있습니다.||문제가 있는 콘텐츠 발견 시 신고해 주세요.',
    },
    collections: {
      title: '컬렉션',
      subtitle: '주제별로 큐레이션된 미디어 컬렉션입니다.',
      emptyTitle: '컬렉션이 없습니다',
      emptyMessage: '아직 생성된 컬렉션이 없습니다.',
      explore: '탐색하기',
      loadErrorTitle: '컬렉션 로드 실패',
      loadErrorMessage: '컬렉션 목록을 불러오는 데 실패했습니다.',
    },
    media: {
      video: '영상',
      image: '이미지',
      audio: '오디오',
      document: '문서',
    },
  },
  en: {
    nav: {
      browse: 'Browse',
      collections: 'Collections',
      about: 'About',
      upload: 'Upload',
      search: 'Search',
      language: 'Language',
    },
    footer: {
      description:
        'A decentralized archive preserving and discovering lost media.\nPowered by IPFS for resilient, permanent storage.',
      explore: 'Explore',
      info: 'Info',
      about: 'About',
      uploadGuide: 'Upload Guide',
      whatIsIpfs: 'What is IPFS?',
      madeWith: 'Made to preserve digital history',
      video: 'Video',
      image: 'Image',
      audio: 'Audio',
      collections: 'Collections',
    },
    common: {
      viewAll: 'View all',
      loading: 'Loading...',
      errorTitle: 'Something went wrong',
      errorMessage: 'There was a problem processing your request. Please try again.',
      retry: 'Try again',
      emptyTitle: 'No content yet',
      emptyMessage: 'No media has been added yet.',
      upload: 'Upload',
      share: 'Share',
      backToList: 'Back to list',
      searchPlaceholder: 'Search by title, description, or tags...',
      search: 'Search',
      clear: 'Clear',
      previous: 'Previous',
      next: 'Next',
      filters: 'Filters',
      sort: 'Sort',
    },
    home: {
      badge: 'IPFS-powered distributed storage',
      title1: 'Preserve lost media',
      title2: 'forever',
      subtitle:
        'Lost Media Archive preserves vanished videos, images, and audio\nacross a distributed network for the long term.',
      explore: 'Explore the archive',
      contribute: 'Contribute media',
      statsTotal: 'Total media',
      statsViews: 'Total views',
      statsVideo: 'Videos',
      statsImage: 'Images',
      whyTitle: 'Why Lost Media Archive?',
      whySubtitle:
        'Unlike centralized platforms, distributed storage enables censorship resistance and permanence.',
      features: {
        distributed: {
          title: 'Distributed storage',
          desc: 'Stored across the IPFS network with no single point of failure.',
        },
        censorship: {
          title: 'Censorship resistant',
          desc: 'No central server means no unilateral takedowns or censorship.',
        },
        privacy: {
          title: 'Privacy by design',
          desc: 'We hide CIDs and expose only internal IDs to reduce traceability.',
        },
      },
      popular: 'Popular',
      recent: 'Recently added',
      noMedia: 'No media has been added yet.',
      uploadFirst: 'Upload the first media',
      categoryTitle: 'Browse by category',
      categorySubtitle: 'Choose a media type to explore.',
      categoryCount: 'files',
      ctaTitle: 'Found lost media?',
      ctaSubtitle:
        'Contribute precious media to the archive.\nYour contribution preserves digital history.',
      ctaButton: 'Upload media',
    },
    browse: {
      title: 'Browse archive',
      total: 'media items in the archive.',
      loadErrorTitle: 'Failed to load media',
      loadErrorMessage: 'Could not load the media list.',
      all: 'All',
      video: 'Video',
      image: 'Image',
      audio: 'Audio',
      document: 'Document',
      sortByDate: 'Newest',
      sortByViews: 'Most viewed',
      sortByTitle: 'Title',
      noResultsTitle: 'No results found',
      noResultsMessage: 'No media matches the current filters.',
      noResultsSearch: 'No results for',
      resetFilters: 'Reset filters',
      searchLabel: 'Search:',
      grid: 'Grid',
      list: 'List',
      ascending: 'Ascending',
      descending: 'Descending',
    },
    upload: {
      title: 'Upload media',
      subtitle:
        'Preserve lost media on IPFS.\nFiles stream directly to IPFS without being stored on the server.',
      drop: 'Drag and drop a file, or click to select',
      dropActive: 'Drop the file here',
      fileTypes: 'Video, image, audio, PDF (max 500MB)',
      fields: {
        title: 'Title',
        description: 'Description',
        tags: 'Tags',
        source: 'Source info',
        lostDate: 'Estimated lost date',
        foundDate: 'Found date',
      },
      placeholders: {
        title: 'Enter a media title',
        description: 'Describe the media',
        tags: 'Comma-separated tags (e.g., ad, 90s, TV)',
        source: 'Provide source or related info',
      },
      upload: 'Upload to IPFS',
      uploading: 'Uploading...',
      successTitle: 'Upload complete!',
      successMessage: 'Your media has been uploaded to IPFS.',
      successHint: 'Redirecting to the media page...',
      infoTitle: '📌 Notes',
      info1: 'Files are streamed directly to IPFS without touching server disk.',
      info2: 'Uploaded content is stored permanently on the distributed network.',
      info3: 'CIDs are not exposed publicly.',
      errorFallback: 'Upload failed. Make sure the IPFS daemon is running.',
      maxSizeError: 'File size cannot exceed 500MB.',
    },
    view: {
      notFoundTitle: 'Media not found',
      notFoundMessage: 'The media does not exist or access is restricted.',
      description: 'Description',
      info: 'Media info',
      type: 'Type',
      size: 'File size',
      mime: 'MIME type',
      createdAt: 'Created at',
      lostDate: 'Estimated lost date',
      foundDate: 'Found date',
      sourceInfo: 'Source info',
      tags: 'Tags',
      distributed: '🔐 Distributed storage',
      distributedText:
        'This content is stored across the IPFS network.\nCIDs are hidden for security.',
      documentPreview: 'Document preview is not supported.',
      openDocument: 'Open document',
      views: 'Views',
    },
    search: {
      title: 'Search',
      subtitle: 'Find lost media.',
      placeholder: 'Search by title, tags, description...',
      popularTags: 'Popular tags',
      tipsTitle: '💡 Search tips',
      tips: 'If you do not remember the exact title, try keywords you recall.||Add a year or era to refine results.||Use filters on the browse page to narrow by media type.',
    },
    about: {
      title: 'Lost Media Archive',
      subtitle: 'A distributed archive project\npreserving lost media forever.',
      missionTitle: '📌 Mission',
      missionBody:
        'In the digital age, countless media are created and disappear.\nTV ads, programs, music videos, and online content\nthat once existed but are no longer accessible are called "lost media".\nThey hold cultural and historical value.\n\nLost Media Archive preserves these works using distributed storage\nand makes them accessible to everyone.',
      howTitle: '🔧 How it works',
      howItems: {
        ipfs: {
          title: 'IPFS storage',
          desc: 'All media is stored on IPFS. Content-addressed storage ensures integrity.',
        },
        cid: {
          title: 'CID protection',
          desc: 'CIDs are never exposed publicly. Internal IDs protect privacy.',
        },
        stream: {
          title: 'Direct streaming',
          desc: 'Uploads stream directly to IPFS without being saved on the server.',
        },
        distributed: {
          title: 'Distributed network',
          desc: 'Replicated across the IPFS network for resilience and availability.',
        },
      },
      featuresTitle: '✨ Highlights',
      features: {
        censorship: {
          title: 'Censorship resistant',
          desc: 'No central server means no unilateral takedowns.',
        },
        permanent: {
          title: 'Permanent preservation',
          desc: 'Once uploaded, content remains as long as the network exists.',
        },
        open: {
          title: 'Open archive',
          desc: 'Anyone can contribute and view content.',
        },
      },
      stackTitle: '🛠️ Tech stack',
      stackFrontend: 'Frontend',
      stackBackend: 'Backend',
      disclaimerTitle: '⚠️ Disclaimer',
      disclaimer: 'Uploading copyrighted content is prohibited.||This archive is intended for cultural and historical preservation.||Uploaders are responsible for their content.||Please report problematic content.',
    },
    collections: {
      title: 'Collections',
      subtitle: 'Curated media collections by theme.',
      emptyTitle: 'No collections yet',
      emptyMessage: 'There are no collections yet.',
      explore: 'Explore',
      loadErrorTitle: 'Failed to load collections',
      loadErrorMessage: 'Could not load the collections list.',
    },
    media: {
      video: 'Video',
      image: 'Image',
      audio: 'Audio',
      document: 'Document',
    },
  },
};

function getByPath(obj: Dictionary, path: string): string | undefined {
  return path.split('.').reduce<string | Dictionary | undefined>((acc, key) => {
    if (acc && typeof acc === 'object') {
      return acc[key];
    }
    return undefined;
  }, obj) as string | undefined;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const getInitialLanguage = (): Language => {
    const saved = localStorage.getItem('lang');
    if (saved === 'ko' || saved === 'en') return saved;
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('ko') ? 'ko' : 'en';
  };

  const [lang, setLang] = useState<Language>(getInitialLanguage);

  const setLanguage = (next: Language) => {
    setLang(next);
    localStorage.setItem('lang', next);
  };

  const toggleLanguage = () => {
    setLanguage(lang === 'ko' ? 'en' : 'ko');
  };

  const t = (key: string) => {
    const value = getByPath(dictionary[lang], key);
    return value ?? key;
  };

  const value = useMemo(() => ({ lang, t, toggleLanguage, setLanguage }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
