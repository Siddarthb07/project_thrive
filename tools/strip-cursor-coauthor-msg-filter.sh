#!/usr/bin/env sh
# Used by git filter-branch --msg-filter; strips Cursor Agent co-author trailers.
exec sed '/^Co-authored-by:.*cursoragent@cursor\.com/d'
