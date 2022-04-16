import { ChevronDownIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { shuffle } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'
import { playlistIdState, playlistState } from '../atoms/playlistAtom'
import useSpotify from '../hooks/useSpotify'
import Songs from "../components/Songs"
import { signOut } from 'next-auth/react'

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
  'from-teal-500',
]

function Center() {
  const { data: session } = useSession()
  const spotifyApi = useSpotify()
  const [color, setColor] = useState(null)
  const playlistId = useRecoilValue(playlistIdState)
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop())
  }, [playlistId])

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body)
      })
      .catch((err) => console.log('Something went wrong!', err))
  }, [spotifyApi, playlistId]);

  console.log(playlist)

  return (
    <div className=" flex-grow h-screen overflow-y-scroll scrollbar-hide ">
      <header className="absolute top-5 right-8">
        <div className="flex cursor-pointer items-center space-x-3 rounded-full bg-black p-1 pr-2 opacity-90 hover:opacity-80 text-white" onClick={signOut}>
          <img
            className="h-10 w-10 rounded-full "
            src={session?.user.image}
            alt=""
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5 text-white" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} p-8 h-80 text-white`}>
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt=""
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
            {playlist?.name}
          </h1>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  )
}

export default Center
