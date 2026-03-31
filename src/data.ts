import { Music, Mic2, Heart, Sparkles } from 'lucide-react';

export interface Song {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
  audioUrl: string;
  imageUrl: string;
}

export interface Section {
  title: string;
  songs: Song[];
}

export interface Theme {
  id: string;
  title: string;
  icon: any;
  sections: Section[];
}

const generateLyrics = (title: string, artist: string) => `
(Instrumental Intro)

[Verse 1]
This is a placeholder lyric for the song "${title}".
Performed by the amazing ${artist}.
Imagine the beautiful melody playing right now.
The words are flowing to the rhythm of the beat.

[Chorus]
Oh, ${title}!
Singing it loud, singing it proud.
With ${artist} leading the crowd.
Music brings us all together.

[Verse 2]
Another verse to keep the song going.
The emotions are high, the music is flowing.
Feel the vibe of the 70s, 80s, 90s, or today.
K-Pop, OPM, let the music play.

[Chorus]
Oh, ${title}!
Singing it loud, singing it proud.
With ${artist} leading the crowd.
Music brings us all together.

[Outro]
Fading out...
Thank you for listening to ${title}.
`;

const createSong = (title: string, artist: string): Song => ({
  id: `${title}-${artist}`.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
  title,
  artist,
  lyrics: generateLyrics(title, artist),
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  imageUrl: `https://picsum.photos/seed/${encodeURIComponent(artist + title)}/400/400`
});

export const themes: Theme[] = [
  {
    id: 'opm',
    title: '🇵🇭 OPM (70s, 80s, 90s)',
    icon: Music,
    sections: [
      {
        title: '1970s',
        songs: [
          createSong('Kay Ganda ng Ating Musika', 'Ryan Cayabyab'),
          createSong('Ikaw', 'Pilita Corrales'),
          createSong('Tayo’y Mga Pinoy', 'Heber Bartolome'),
          createSong('Anak', 'Freddie Aguilar'),
          createSong('Handog', 'Florante'),
          createSong('Awit ng Barkada', 'Apo Hiking Society'),
          createSong('Bato sa Buhangin', 'Cinderella'),
          createSong('Ikaw ang Miss Universe ng Buhay Ko', 'Hotdog'),
          createSong('Kahit Maputi na ang Buhok Ko', 'Rey Valera'),
        ]
      },
      {
        title: '1980s',
        songs: [
          createSong('Tuwing Umuulan at Kapiling Ka', 'Basil Valdez'),
          createSong('Himig Natin', 'Juan Dela Cruz Band'),
          createSong('Sana’y Wala Nang Wakas', 'Sharon Cuneta'),
          createSong('Kumusta Ka', 'Rey Valera'),
          createSong('Nandito Ako', 'Ogie Alcasid'),
          createSong('Nothing’s Gonna Stop Us Now', 'Daniel Padilla'),
          createSong('Ewan', 'Apo Hiking Society'),
          createSong('Bulag, Pipi at Bingi', 'Freddie Aguilar'),
          createSong('Kahit Isang Saglit', 'Martin Nievera'),
        ]
      },
      {
        title: '1990s',
        songs: [
          createSong('Himala', 'Rivermaya'),
          createSong('Pare Ko', 'Eraserheads'),
          createSong('Forevermore', 'Side A'),
          createSong('214', 'Rivermaya'),
          createSong('Ligaya', 'Eraserheads'),
          createSong('Sundo', 'Imago'),
          createSong('With a Smile', 'Eraserheads'),
          createSong('Next in Line', 'After Image'),
          createSong('214 (Live)', 'Rivermaya'),
        ]
      }
    ]
  },
  {
    id: 'kpop',
    title: '🇰🇷 K-POP GROUPS',
    icon: Sparkles,
    sections: [
      {
        title: 'BTS',
        songs: [
          createSong('Dynamite', 'BTS'),
          createSong('Spring Day', 'BTS'),
          createSong('Butter', 'BTS'),
        ]
      },
      {
        title: 'BLACKPINK',
        songs: [
          createSong('How You Like That', 'BLACKPINK'),
          createSong('Kill This Love', 'BLACKPINK'),
          createSong('DDU-DU DDU-DU', 'BLACKPINK'),
        ]
      },
      {
        title: 'EXO',
        songs: [
          createSong('Growl', 'EXO'),
          createSong('Love Shot', 'EXO'),
          createSong('Call Me Baby', 'EXO'),
        ]
      },
      {
        title: 'TWICE',
        songs: [
          createSong('TT', 'TWICE'),
          createSong('Cheer Up', 'TWICE'),
          createSong('Feel Special', 'TWICE'),
        ]
      },
      {
        title: 'BIGBANG',
        songs: [
          createSong('Fantastic Baby', 'BIGBANG'),
          createSong('Haru Haru', 'BIGBANG'),
          createSong('Bang Bang Bang', 'BIGBANG'),
        ]
      }
    ]
  },
  {
    id: 'categories',
    title: '🎭 FEATURED CATEGORIES',
    icon: Heart,
    sections: [
      {
        title: '😊 Happy Songs',
        songs: [
          createSong('With a Smile', 'Eraserheads'),
          createSong('Cheer Up', 'TWICE'),
          createSong('Dynamite', 'BTS'),
        ]
      },
      {
        title: '😢 Sad Songs',
        songs: [
          createSong('Haru Haru', 'BIGBANG'),
          createSong('Anak', 'Freddie Aguilar'),
          createSong('Spring Day', 'BTS'),
        ]
      },
      {
        title: '💪 Inspiring Songs',
        songs: [
          createSong('Next in Line', 'After Image'),
          createSong('Tayo’y Mga Pinoy', 'Heber Bartolome'),
          createSong('Feel Special', 'TWICE'),
        ]
      }
    ]
  },
  {
    id: 'favorites',
    title: '⭐ FAVORITE SINGERS',
    icon: Mic2,
    sections: [
      {
        title: 'Freddie Aguilar',
        songs: [
          createSong('Anak', 'Freddie Aguilar'),
          createSong('Bayan Ko', 'Freddie Aguilar'),
          createSong('Magdalena', 'Freddie Aguilar'),
        ]
      },
      {
        title: 'Ely Buendia',
        songs: [
          createSong('Pare Ko', 'Ely Buendia'),
          createSong('Ligaya', 'Ely Buendia'),
          createSong('With a Smile', 'Ely Buendia'),
        ]
      },
      {
        title: 'Jungkook',
        songs: [
          createSong('Seven', 'Jungkook'),
          createSong('Euphoria', 'Jungkook'),
          createSong('Still With You', 'Jungkook'),
        ]
      },
      {
        title: 'Taeyeon',
        songs: [
          createSong('INVU', 'Taeyeon'),
          createSong('Fine', 'Taeyeon'),
          createSong('I', 'Taeyeon'),
        ]
      },
      {
        title: 'Sarah Geronimo',
        songs: [
          createSong('Tala', 'Sarah Geronimo'),
          createSong('Kilometro', 'Sarah Geronimo'),
          createSong('Forever’s Not Enough', 'Sarah Geronimo'),
        ]
      }
    ]
  }
];
