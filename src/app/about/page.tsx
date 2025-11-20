import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AboutPage() {
  return (
    <div className="mt-4">
      <h1 className="sr-only">About page</h1>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Контакты</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm sm:text-base">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Логин</span>
            <span className="font-medium break-all">budapesht6666</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Telegram</span>
            <a
              href="https://t.me/budoPesht666"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary hover:underline break-all"
            >
              @budapesht6666
            </a>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">GitHub</span>
            <a
              href="https://github.com/budapesht6666"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary hover:underline break-all"
            >
              github.com/budapesht6666
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
