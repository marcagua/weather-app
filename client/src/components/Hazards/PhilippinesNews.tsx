import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, AlertTriangle, Newspaper } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';

interface NewsItem {
  title: string;
  link: string;
  date: string;
  content: string;
  source: string;
}

const PhilippinesNews = () => {
  // Fetch Philippines news related to weather and hazards
  const { data: newsData, isLoading, error } = useQuery({
    queryKey: ['/api/philippines-news'],
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Get source color
  const getSourceColor = (source: string) => {
    switch (source) {
      case 'GMA News':
        return 'bg-red-500 hover:bg-red-600';
      case 'Manila Bulletin':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'Philippine Star':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'ABS-CBN':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  // Truncate content
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (!content) return '';
    return content.length > maxLength
      ? content.substring(0, maxLength) + '...'
      : content;
  };

  if (isLoading) {
    return (
      <div className="my-8">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h2 className="text-xl font-semibold">Philippines Weather News</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-1/3" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !newsData) {
    return (
      <div className="my-8">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h2 className="text-xl font-semibold">Philippines Weather News</h2>
        </div>
        <Card className="bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center p-4">
              <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
              <p className="text-amber-800">Unable to load Philippines news at this time.</p>
              <p className="text-sm text-amber-600 mt-2">
                Please check your internet connection or try again later.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Combine all news sources into a single array
  const allNews: NewsItem[] = Object.entries(newsData)
    .flatMap(([source, items]: [string, any[]]) => 
      items.map((item: any) => ({...item, source}))
    )
    // Sort by date, most recent first
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    // Take top 8 items
    .slice(0, 8);

  // If no weather-related news
  if (allNews.length === 0) {
    return (
      <div className="my-8">
        <div className="flex items-center gap-2 mb-4">
          <Newspaper className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Philippines Weather News</h2>
        </div>
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center p-4">
              <Newspaper className="h-12 w-12 text-blue-500 mb-2" />
              <p className="text-blue-800">No weather-related news available at this time.</p>
              <p className="text-sm text-blue-600 mt-2">
                Check back later for updates on weather events in the Philippines.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="my-8">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-semibold">Philippines Weather News</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allNews.map((item, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-base font-medium line-clamp-2">
                  {item.title}
                </CardTitle>
                <Badge className={`shrink-0 ${getSourceColor(item.source)}`}>
                  {item.source}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                {formatDate(item.date)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {truncateContent(item.content)}
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Read full article <ExternalLink className="h-3 w-3" />
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Weather-related news sourced from major Philippines news outlets. 
          Updated every 30 minutes.
        </p>
      </div>
    </div>
  );
};

export default PhilippinesNews;