source "https://rubygems.org"

# Previous version
# gem "jekyll", "~> 3.8.6"

# The latest version
gem "jekyll", github: "jekyll/jekyll"

# Under the J4 the jekyll-pageless-redirects installed in plugins causes error

# If you want to use GitHub Pages, remove the "gem "jekyll"" above and
# uncomment the line below. To upgrade, run `bundle update github-pages`.
# beautiful-jekyll use "github-pages" method, аnd minimal-mistakes  recommend it
# gem "github-pages", group: :jekyll_plugins

# Liquid-C
gem "liquid-c"

# Plugins
# beautiful-jekyll and minimal-mistakes use _config / gem method to install.
# But I get dependency error trying run the site without jekyll-include-cache
# here
group :jekyll_plugins do
  gem "jekyll-include-cache"
  gem "jekyll-email-protect"
  gem "jekyll-feed"
  gem "jekyll-paginate-v2"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jekyll-tidy"
end
