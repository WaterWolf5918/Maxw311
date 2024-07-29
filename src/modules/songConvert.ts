import { Message, EmbedBuilder } from 'discord.js';

export async function songConvert(message:Message){
    const ytMusicRegex = /https:\/\/music\.youtube\.com\S*/gm;
    const spotifyRegex = /https:\/\/open\.spotify\.com\S*/gm;
    const appleMusicRegex = /https:\/\/music\.apple\.com\S*/gm;
    const ytMusic = ytMusicRegex.exec(message.content);
    const spotify = spotifyRegex.exec(message.content);
    const appleMusic = appleMusicRegex.exec(message.content);
    // console.log(appleMusic);

    if (ytMusic !== null){
        await buildSongEmbed(message);
    }
    else if (spotify !== null){
        await buildSongEmbed(message);
    }
    else if(appleMusic !== null){
        await buildSongEmbed(message);
    }
}

async function buildSongEmbed(message) {
    const list = await songLink(message.content);
    const embed = new EmbedBuilder().setTitle('Universal Music Links');
    let body = '';
    Object.keys(list).forEach((service,i) => {
        const url = Object.values(list)[i];
        if(url == '404'){
            body += `* ${service} (No Match)\n`;
            return;
        }
        body += `* [${service}](<${url}>)\n`;
    });
    embed.setDescription(body);
    embed.setFooter({
        text: 'Powered by Songlink',
    });
    message.reply({embeds: [embed]});
}

async function songLink(url){
    const list = {
        Youtube: '',
        YoutubeMusic: '',
        Spotify: '',
        AppleMusic: '',
        AmazonMusic: '',

        Pandora: '',
        Tidal: '',
        Soundcloud: ''
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = await fetch(`https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(url)}`);
    data = await data.json();
    list.Youtube = (data.linksByPlatform.youtube === undefined ? '404' :data.linksByPlatform.youtube.url);
    list.YoutubeMusic = (data.linksByPlatform.youtubeMusic === undefined ? '404' :data.linksByPlatform.youtubeMusic.url);
    list.Spotify = (data.linksByPlatform.spotify === undefined ? '404' :data.linksByPlatform.spotify.url);
    list.AppleMusic = (data.linksByPlatform.appleMusic === undefined ? '404' :data.linksByPlatform.appleMusic.url);
    list.AmazonMusic = (data.linksByPlatform.amazonMusic === undefined ? '404' :data.linksByPlatform.amazonMusic.url);
    list.Pandora = (data.linksByPlatform.pandora === undefined ? '404' :data.linksByPlatform.pandora.url);
    list.Tidal = (data.linksByPlatform.tidal === undefined ? '404' :data.linksByPlatform.tidal.url);
    list.Soundcloud = (data.linksByPlatform.soundcloud === undefined ? '404' :data.linksByPlatform.soundcloud.url);
    return list;
}