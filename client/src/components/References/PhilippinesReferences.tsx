import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExternalLink, Info, Phone, ShieldAlert } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface DataSource {
  name: string;
  description: string;
  website: string;
}

interface EmergencyContact {
  name: string;
  number: string;
}

interface ReferenceData {
  weatherDataSources: DataSource[];
  emergencyContacts: EmergencyContact[];
  disclaimer: string;
}

const PhilippinesReferences = () => {
  // Fetch reference data
  const { data, isLoading, error } = useQuery<ReferenceData>({
    queryKey: ['/api/references'],
  });

  if (isLoading) {
    return (
      <div className="my-8 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 space-y-8">
      {/* Disclaimer */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-500" />
          Disclaimer
        </h2>
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTitle className="text-amber-700">Important Notice</AlertTitle>
          <AlertDescription className="text-amber-600">
            {data?.disclaimer || "This application provides weather information for educational and informational purposes only. While we strive for accuracy, we make no guarantees regarding the completeness, reliability, or timeliness of the weather data. During severe weather events, always follow the official directives issued by local authorities such as PAGASA, NDRRMC, and local disaster risk reduction offices. Do not make critical decisions based solely on this application."}
          </AlertDescription>
        </Alert>
      </section>

      {/* Data Sources */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          Weather Data Sources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.weatherDataSources.map((source, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{source.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {source.description}
                </p>
                <a 
                  href={source.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  Visit website <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          )) || (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>OpenWeatherMap API</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Global weather data service providing current, forecast, and historical weather information.
                  </p>
                  <a 
                    href="https://openweathermap.org/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Visit website <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>PAGASA</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Philippine Atmospheric, Geophysical and Astronomical Services Administration - the national meteorological agency of the Philippines.
                  </p>
                  <a 
                    href="https://bagong.pagasa.dost.gov.ph/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Visit website <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>PHIVOLCS</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Philippine Institute of Volcanology and Seismology - monitors volcanic activity and earthquakes in the Philippines.
                  </p>
                  <a 
                    href="https://www.phivolcs.dost.gov.ph/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Visit website <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </section>

      {/* Emergency Contacts */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Phone className="h-5 w-5 text-red-500" />
          Emergency Contacts
        </h2>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {data?.emergencyContacts.map((contact, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-red-900">{contact.name}</h3>
                    <span className="font-mono text-red-700">{contact.number}</span>
                  </div>
                  {index < (data?.emergencyContacts.length || 0) - 1 && <Separator className="my-2 bg-red-200" />}
                </div>
              )) || (
                <>
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-red-900">National Emergency Hotline</h3>
                      <span className="font-mono text-red-700">911</span>
                    </div>
                    <Separator className="my-2 bg-red-200" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-red-900">Philippine Red Cross</h3>
                      <span className="font-mono text-red-700">143</span>
                    </div>
                    <Separator className="my-2 bg-red-200" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-red-900">NDRRMC Operations Center</h3>
                      <span className="font-mono text-red-700">+63 (2) 8911-1406</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* About The App */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-gray-500" />
          About This App
        </h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-4">
              This weather application is designed to provide comprehensive weather information for the Philippines and around the world. The app includes current weather conditions, forecasts, hazard warnings, weather trends, and important reference information.
            </p>
            <p className="text-gray-600 mb-4">
              For Philippine users, we've integrated local news sources specifically related to weather events, natural disasters, and climate information. We also provide direct links to official government weather agencies and emergency services.
            </p>
            <p className="text-gray-600">
              The application automatically detects your location to provide relevant weather information, but you can also search for any location worldwide to check weather conditions and forecasts.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default PhilippinesReferences;