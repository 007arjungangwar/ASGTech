import React, { useEffect, useState } from 'react'
import { useDatabaseStore } from '@/store/useDatabaseStore'
import { Video as VideoIcon, Calendar, Clock, Compass } from 'lucide-react'

export const Videos: React.FC = () => {
  const { videoPlaylists, videoLibrary, loadAllSiteData } = useDatabaseStore()
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null)

  useEffect(() => {
    loadAllSiteData()
  }, [])

  const currentPlaylists = videoPlaylists.filter(p => p.status === 'active')

  // Filter video list by selected playlist
  const displayedVideos = videoLibrary.filter(v => {
    if (v.status !== 'active') return false
    if (!selectedPlaylist) return true
    return v.playlistId === selectedPlaylist
  })

  // Convert watch URL to embed
  const getEmbedUrl = (url: string) => {
    const value = String(url || '').trim()
    if (!value) return ''
    if (value.includes('youtube.com/watch?v=')) {
      return value.replace('watch?v=', 'embed/')
    }
    if (value.includes('youtu.be/')) {
      return `https://www.youtube.com/embed/${value.split('youtu.be/')[1].split(/[?&]/)[0]}`
    }
    return value
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10 pb-20">
      <div className="space-y-2 border-b pb-4 dark:border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Video Lessons</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Walkthrough lessons, theory definitions, and coding assignment solutions.
        </p>
      </div>

      {/* Playlists Filter Row */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedPlaylist(null)}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            !selectedPlaylist
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
          }`}
        >
          All Playlists
        </button>
        {currentPlaylists.map((pl, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedPlaylist(pl.id)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              selectedPlaylist === pl.id
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
            }`}
          >
            {pl.title}
          </button>
        ))}
      </div>

      {displayedVideos.length === 0 ? (
        <div className="text-center py-16 text-slate-400 space-y-3 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Compass className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700" />
          <h3 className="text-sm font-semibold">No video lessons found</h3>
          <p className="text-xs">Select another playlist filter or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedVideos.map((video, idx) => (
            <article
              key={idx}
              className="group overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-sm hover:shadow-md dark:border-slate-800/50 dark:bg-slate-900 transition-all glass-panel flex flex-col"
            >
              {/* Thumbnail/Iframe watch */}
              <div className="aspect-video w-full bg-slate-950">
                {video.videoUrl ? (
                  <iframe
                    title={video.title}
                    src={getEmbedUrl(video.videoUrl)}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-600">
                    <VideoIcon className="h-10 w-10" />
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded">
                    {video.playlistTitle || 'Lecture'}
                  </span>
                  <h3 className="text-sm font-bold dark:text-white line-clamp-2 leading-snug">
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {video.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(video.uploadedAt || '').toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {video.duration || '12 mins'}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
