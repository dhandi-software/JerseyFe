import type {
    ArticleDetail,
    NewsListItem,
    VideoListItem,
    AdvertisementResponse,
} from "~/api/types";

export interface UseArticleReturn {
    article: ArticleDetail | null;
    relatedNews: NewsListItem[];
    videos: VideoListItem[];
    ads: AdvertisementResponse[];
    loading: boolean;
    errors: {
        article?: string;
        relatedNews?: string;
        videos?: string;
    };
}

export interface UseHomeReturn {
    latestNews: NewsListItem[];
    trendingVideos: VideoListItem[];
    nickelNews: NewsListItem[];
    miningNews: NewsListItem[];
    marketNews: NewsListItem[];
    technologyNews: NewsListItem[];
    trendingNews: NewsListItem[];
    headlineNews: NewsListItem[];
    exclusiveInterviewNews: NewsListItem[];
    loading: boolean;
    errors: {
        latestNews?: string;
        trendingVideos?: string;
        nickelNews?: string;
        miningNews?: string;
        marketNews?: string;
        technologyNews?: string;
        trendingNews?: string;
        headlineNews?: string;
        exclusiveInterviewNews?: string;
    };
}
