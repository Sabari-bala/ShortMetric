import random
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone

from apps.links.models import Link
from apps.analytics.models import Click


BROWSERS = ['Chrome', 'Chrome', 'Chrome', 'Edge', 'Firefox', 'Safari', 'Safari']
DEVICES = ['Desktop', 'Desktop', 'Desktop', 'Mobile', 'Mobile', 'Tablet']
OS_BY_DEVICE = {
    'Desktop': ['Windows', 'Windows', 'Windows', 'macOS', 'Linux'],
    'Mobile': ['Android', 'Android', 'iOS'],
    'Tablet': ['iOS', 'Android'],
}
REFERRERS = [
    'google.com', 'google.com', 'google.com',
    'direct',
    'instagram.com', 'facebook.com', 'twitter.com',
    'linkedin.com', 'reddit.com', 'youtube.com',
]
UA_BY_BROWSER = {
    'Chrome': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Edge': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    'Firefox': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
    'Safari': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
}

SAMPLE_LINKS = [
    ('google-home', 'https://www.google.com', 52),
    ('python-docs', 'https://docs.python.org/3/', 38),
    ('github-repo', 'https://github.com/Sabari-bala/ShortMetric', 24),
    ('portfolio', 'https://sabari-bala.dev', 20),
    ('youtube-video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 15),
    ('product-launch', 'https://example.com/launch', 12),
    ('newsletter', 'https://example.com/newsletter/signup', 8),
    ('resume', 'https://example.com/resume.pdf', 4),
]


class Command(BaseCommand):
    help = 'Seed demo links and clicks for ShortMetric analytics.'

    def add_arguments(self, parser):
        parser.add_argument('--user', default='testuser', help='Username (default: testuser)')
        parser.add_argument('--reset', action='store_true', help='Replace existing demo links')

    def handle(self, *args, **options):
        username = options['user']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            self.stderr.write(self.style.ERROR(f'User "{username}" not found.'))
            return

        if options['reset']:
            codes = [c for c, _, _ in SAMPLE_LINKS]
            existing = Link.objects.filter(user=user, short_code__in=codes)
            count = existing.count()
            existing.delete()
            self.stdout.write(self.style.WARNING(f'Removed {count} existing demo links.'))

        now = timezone.now()
        total_clicks = 0

        for code, url, target_clicks in SAMPLE_LINKS:
            link, created = Link.objects.get_or_create(
                user=user,
                short_code=code,
                defaults={'original_url': url},
            )
            if not created:
                link.original_url = url
                link.save()
                link.clicks.all().delete()

            for _ in range(target_clicks):
                days_ago = random.choices(
                    range(0, 14),
                    weights=list(range(14, 0, -1)),
                    k=1,
                )[0]

                hour = random.choices(
                    range(24),
                    weights=[1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 7, 7, 6, 6, 6, 6, 7, 8, 8, 7, 5, 3, 2],
                    k=1,
                )[0]
                minute = random.randint(0, 59)

                clicked_at = (now - timedelta(days=days_ago)).replace(
                    hour=hour, minute=minute, second=0, microsecond=0
                )

                browser = random.choice(BROWSERS)
                device = random.choice(DEVICES)
                os_name = random.choice(OS_BY_DEVICE[device])
                referrer = random.choice(REFERRERS)

                click = Click.objects.create(
                    link=link,
                    referrer=None if referrer == 'direct' else referrer,
                    user_agent=UA_BY_BROWSER[browser][:512],
                    browser=browser,
                    device_category=device,
                    operating_system=os_name,
                )
                Click.objects.filter(pk=click.pk).update(clicked_at=clicked_at)
                total_clicks += 1

            self.stdout.write(f'  {code:<20} -> {url}  ({target_clicks} clicks)')

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(
            f'Done. {len(SAMPLE_LINKS)} links, {total_clicks} clicks total for user "{username}".'
        ))
        self.stdout.write('')
        self.stdout.write('Refresh http://localhost:5173/analytics to see the charts.')
