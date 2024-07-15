import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../command.js';
import { exec } from 'child_process';
import { fetchWeatherApi } from 'openmeteo';
import { ConfigHelper, roundDec } from '../utils.js';

const weatherCodes = {
    '0': {
        'day': {
            'description': 'Sunny',
            'image': 'http://openweathermap.org/img/wn/01d@2x.png'
        },
        'night': {
            'description': 'Clear',
            'image': 'http://openweathermap.org/img/wn/01n@2x.png'
        }
    },
    '1': {
        'day': {
            'description': 'Mainly Sunny',
            'image': 'http://openweathermap.org/img/wn/01d@2x.png'
        },
        'night': {
            'description': 'Mainly Clear',
            'image': 'http://openweathermap.org/img/wn/01n@2x.png'
        }
    },
    '2': {
        'day': {
            'description': 'Partly Cloudy',
            'image': 'http://openweathermap.org/img/wn/02d@2x.png'
        },
        'night': {
            'description': 'Partly Cloudy',
            'image': 'http://openweathermap.org/img/wn/02n@2x.png'
        }
    },
    '3': {
        'day': {
            'description': 'Cloudy',
            'image': 'http://openweathermap.org/img/wn/03d@2x.png'
        },
        'night': {
            'description': 'Cloudy',
            'image': 'http://openweathermap.org/img/wn/03n@2x.png'
        }
    },
    '45': {
        'day': {
            'description': 'Foggy',
            'image': 'http://openweathermap.org/img/wn/50d@2x.png'
        },
        'night': {
            'description': 'Foggy',
            'image': 'http://openweathermap.org/img/wn/50n@2x.png'
        }
    },
    '48': {
        'day': {
            'description': 'Rime Fog',
            'image': 'http://openweathermap.org/img/wn/50d@2x.png'
        },
        'night': {
            'description': 'Rime Fog',
            'image': 'http://openweathermap.org/img/wn/50n@2x.png'
        }
    },
    '51': {
        'day': {
            'description': 'Light Drizzle',
            'image': 'http://openweathermap.org/img/wn/09d@2x.png'
        },
        'night': {
            'description': 'Light Drizzle',
            'image': 'http://openweathermap.org/img/wn/09n@2x.png'
        }
    },
    '53': {
        'day': {
            'description': 'Drizzle',
            'image': 'http://openweathermap.org/img/wn/09d@2x.png'
        },
        'night': {
            'description': 'Drizzle',
            'image': 'http://openweathermap.org/img/wn/09n@2x.png'
        }
    },
    '55': {
        'day': {
            'description': 'Heavy Drizzle',
            'image': 'http://openweathermap.org/img/wn/09d@2x.png'
        },
        'night': {
            'description': 'Heavy Drizzle',
            'image': 'http://openweathermap.org/img/wn/09n@2x.png'
        }
    },
    '56': {
        'day': {
            'description': 'Light Freezing Drizzle',
            'image': 'http://openweathermap.org/img/wn/09d@2x.png'
        },
        'night': {
            'description': 'Light Freezing Drizzle',
            'image': 'http://openweathermap.org/img/wn/09n@2x.png'
        }
    },
    '57': {
        'day': {
            'description': 'Freezing Drizzle',
            'image': 'http://openweathermap.org/img/wn/09d@2x.png'
        },
        'night': {
            'description': 'Freezing Drizzle',
            'image': 'http://openweathermap.org/img/wn/09n@2x.png'
        }
    },
    '61': {
        'day': {
            'description': 'Light Rain',
            'image': 'http://openweathermap.org/img/wn/10d@2x.png'
        },
        'night': {
            'description': 'Light Rain',
            'image': 'http://openweathermap.org/img/wn/10n@2x.png'
        }
    },
    '63': {
        'day': {
            'description': 'Rain',
            'image': 'http://openweathermap.org/img/wn/10d@2x.png'
        },
        'night': {
            'description': 'Rain',
            'image': 'http://openweathermap.org/img/wn/10n@2x.png'
        }
    },
    '65': {
        'day': {
            'description': 'Heavy Rain',
            'image': 'http://openweathermap.org/img/wn/10d@2x.png'
        },
        'night': {
            'description': 'Heavy Rain',
            'image': 'http://openweathermap.org/img/wn/10n@2x.png'
        }
    },
    '66': {
        'day': {
            'description': 'Light Freezing Rain',
            'image': 'http://openweathermap.org/img/wn/10d@2x.png'
        },
        'night': {
            'description': 'Light Freezing Rain',
            'image': 'http://openweathermap.org/img/wn/10n@2x.png'
        }
    },
    '67': {
        'day': {
            'description': 'Freezing Rain',
            'image': 'http://openweathermap.org/img/wn/10d@2x.png'
        },
        'night': {
            'description': 'Freezing Rain',
            'image': 'http://openweathermap.org/img/wn/10n@2x.png'
        }
    },
    '71': {
        'day': {
            'description': 'Light Snow',
            'image': 'http://openweathermap.org/img/wn/13d@2x.png'
        },
        'night': {
            'description': 'Light Snow',
            'image': 'http://openweathermap.org/img/wn/13n@2x.png'
        }
    },
    '73': {
        'day': {
            'description': 'Snow',
            'image': 'http://openweathermap.org/img/wn/13d@2x.png'
        },
        'night': {
            'description': 'Snow',
            'image': 'http://openweathermap.org/img/wn/13n@2x.png'
        }
    },
    '75': {
        'day': {
            'description': 'Heavy Snow',
            'image': 'http://openweathermap.org/img/wn/13d@2x.png'
        },
        'night': {
            'description': 'Heavy Snow',
            'image': 'http://openweathermap.org/img/wn/13n@2x.png'
        }
    },
    '77': {
        'day': {
            'description': 'Snow Grains',
            'image': 'http://openweathermap.org/img/wn/13d@2x.png'
        },
        'night': {
            'description': 'Snow Grains',
            'image': 'http://openweathermap.org/img/wn/13n@2x.png'
        }
    },
    '80': {
        'day': {
            'description': 'Light Showers',
            'image': 'http://openweathermap.org/img/wn/09d@2x.png'
        },
        'night': {
            'description': 'Light Showers',
            'image': 'http://openweathermap.org/img/wn/09n@2x.png'
        }
    },
    '81': {
        'day': {
            'description': 'Showers',
            'image': 'http://openweathermap.org/img/wn/09d@2x.png'
        },
        'night': {
            'description': 'Showers',
            'image': 'http://openweathermap.org/img/wn/09n@2x.png'
        }
    },
    '82': {
        'day': {
            'description': 'Heavy Showers',
            'image': 'http://openweathermap.org/img/wn/09d@2x.png'
        },
        'night': {
            'description': 'Heavy Showers',
            'image': 'http://openweathermap.org/img/wn/09n@2x.png'
        }
    },
    '85': {
        'day': {
            'description': 'Light Snow Showers',
            'image': 'http://openweathermap.org/img/wn/13d@2x.png'
        },
        'night': {
            'description': 'Light Snow Showers',
            'image': 'http://openweathermap.org/img/wn/13n@2x.png'
        }
    },
    '86': {
        'day': {
            'description': 'Snow Showers',
            'image': 'http://openweathermap.org/img/wn/13d@2x.png'
        },
        'night': {
            'description': 'Snow Showers',
            'image': 'http://openweathermap.org/img/wn/13n@2x.png'
        }
    },
    '95': {
        'day': {
            'description': 'Thunderstorm',
            'image': 'http://openweathermap.org/img/wn/11d@2x.png'
        },
        'night': {
            'description': 'Thunderstorm',
            'image': 'http://openweathermap.org/img/wn/11n@2x.png'
        }
    },
    '96': {
        'day': {
            'description': 'Light Thunderstorms With Hail',
            'image': 'http://openweathermap.org/img/wn/11d@2x.png'
        },
        'night': {
            'description': 'Light Thunderstorms With Hail',
            'image': 'http://openweathermap.org/img/wn/11n@2x.png'
        }
    },
    '99': {
        'day': {
            'description': 'Thunderstorm With Hail',
            'image': 'http://openweathermap.org/img/wn/11d@2x.png'
        },
        'night': {
            'description': 'Thunderstorm With Hail',
            'image': 'http://openweathermap.org/img/wn/11n@2x.png'
        }
    }
};


export const command: Command = {
    commandBuilder: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('weather commands')
        .addSubcommand(sub =>
            sub
                .setName('list')
                .setDescription('Get list of weather for all users who have added there location')
        )
        .addSubcommand(sub =>
            sub
                .setName('bylocation')
                .setDescription('Get weather for input location (WARNING will display location provided by default)')
                .addStringOption(option =>
                    option
                        .setName('location')
                        .setDescription('location in the following format (Pittsburgh PA)')
                        .setRequired(true)
                )
                .addBooleanOption(option =>
                    option
                        .setName('hidelocation')
                        .setDescription('Set if location should be sent')
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('adduserlocation')
                .setDescription('Add your location for weather (your location will not be shown only your username)')
                .addStringOption(option =>
                    option
                        .setName('location')
                        .setDescription('location in the following format (Pittsburgh PA)')
                        .setRequired(true)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName('byuser')
                .setDescription('Gets weather for users location if they are in the database')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user\'s weather you would like to get')
                        .setRequired(true)
                )
        ),


    runnable: async function (interaction: ChatInputCommandInteraction) {
        const userDatabase = new ConfigHelper('./userWeather.json');
        switch (interaction.options.getSubcommand()) {
            case 'adduserlocation': {
                await interaction.reply({content: 'Getting location from city', ephemeral: true });
                const quary = interaction.options.get('location').value.toString();
                const locationFetch = await fetch(`https://nominatim.openstreetmap.org/search?q=${quary.replaceAll(' ', '+')}&format=jsonv2`, { headers: { 'User-Agent': 'Maxwell-Discord-Bot_firewolf@null.net/1.0' } });
                const location: { place_id: number, display_name: string, lat: number, lon: number, name: string } = (await locationFetch.json())[0];
                await interaction.editReply(`Saved ${roundDec(location.lat,3)},${roundDec(location.lon,3)} for your location.\nLocaiton is cut down to 3 decimal places for privacy.\n\n**This will not be shared with other users.**`);
                userDatabase.set(interaction.user.id,{lat: roundDec(location.lat,3), lon: roundDec(location.lon,3)});
                break;
            }

            case 'bylocation': {
                await interaction.reply('Getting location from city');
                const quary = interaction.options.get('location').value.toString();
                const locationFetch = await fetch(`https://nominatim.openstreetmap.org/search?q=${quary.replaceAll(' ', '+')}&format=jsonv2`, { headers: { 'User-Agent': 'Maxwell-Discord-Bot_firewolf@null.net/1.0' } });
                const location: { place_id: number, display_name: string, lat: number, lon: number, name: string } = (await locationFetch.json())[0];
                let hideLocation = false;
                if (interaction.options.get('hidelocation') !== null) {
                    hideLocation = (interaction.options.get('hidelocation').value as boolean);
                }
                await interaction.editReply(`Getting Weather for ${hideLocation ? 'Redacted' : quary}`);
                const params = {
                    'latitude': location.lat,
                    'longitude': location.lon,
                    'current': ['temperature_2m', 'relative_humidity_2m', 'is_day', 'precipitation', 'weather_code', 'wind_speed_10m', 'wind_direction_10m'],
                    'daily': ['temperature_2m_max', 'temperature_2m_min', 'precipitation_sum'],
                    'temperature_unit': 'fahrenheit',
                    'wind_speed_unit': 'mph',
                    'precipitation_unit': 'inch',
                    'timezone': 'auto',
                    'forecast_days': 1
                };
                const url = 'https://api.open-meteo.com/v1/forecast';
                const responses = await fetchWeatherApi(url, params);
                const response = responses[0];
                const current = response.current()!;
                const utcOffsetSeconds = response.utcOffsetSeconds();
                const weatherData = {
                    time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                    temperature2m: current.variables(0)!.value(),
                    relativeHumidity2m: current.variables(1)!.value(),
                    isDay: current.variables(2)!.value(),
                    precipitation: current.variables(3)!.value(),
                    weatherCode: current.variables(4)!.value(),
                    windSpeed10m: current.variables(5)!.value(),
                    windDirection10m: current.variables(6)!.value(),
                };
                const embed = new EmbedBuilder()
                    .setTitle(`Weather for ${hideLocation ? 'Redacted' : quary} at ${new Date().toUTCString()}`)
                    .setDescription(weatherCodes[weatherData.weatherCode].day.description)
                    .addFields(
                        {
                            name: 'Temperature',
                            value: `${Math.round(weatherData.temperature2m)} F`,
                            inline: true
                        },
                        {
                            name: 'Relative Humidity',
                            value: `${Math.round(weatherData.relativeHumidity2m)}`,
                            inline: true
                        },
                        {
                            name: 'Daily Precipitation',
                            value: `${weatherData.precipitation} In`,
                            inline: true
                        },
                        {
                            name: 'Wind Speed',
                            value: `${weatherData.windSpeed10m} MPH`,
                            inline: true
                        },
                        {
                            name: 'Wind Direction',
                            value: `${Math.round(weatherData.windDirection10m)}`,
                            inline: true
                        },
                    )
                    .setThumbnail(weatherCodes[weatherData.weatherCode][weatherData.isDay ? 'day': 'night'].image)
                    .setColor('#0000FF')
                    .setFooter({
                        text: 'Powered By Open-Meteo And OpenStreetMap',
                    });
                interaction.editReply({embeds: [embed]});
                break;

                //Pittsburgh PA
            }
            // 18T21:30:00.000Z","temperature2m":78.01789855957031,"relativeHumidity2m":52,"precipitation":0,"windSpeed10m":3.1157801151275635,"windDirection10m":338.96240234375} 

            case 'byuser': {
                const user = await interaction.options.getUser('user');
                await interaction.reply(`Getting location for ${user.displayName}`);
                if(userDatabase.getFull()[user.id] === undefined){
                    await interaction.editReply(`${user.displayName} Is not in the user weather location database.`);
                    return;
                }
                const params = {
                    'latitude': userDatabase.getFull()[user.id].lat,
                    'longitude': userDatabase.getFull()[user.id].lon,
                    'current': ['temperature_2m', 'relative_humidity_2m', 'is_day', 'precipitation', 'weather_code', 'wind_speed_10m', 'wind_direction_10m'],
                    'daily': ['temperature_2m_max', 'temperature_2m_min', 'precipitation_sum'],
                    'temperature_unit': 'fahrenheit',
                    'wind_speed_unit': 'mph',
                    'precipitation_unit': 'inch',
                    'timezone': 'auto',
                    'forecast_days': 1
                };
                const url = 'https://api.open-meteo.com/v1/forecast';
                const responses = await fetchWeatherApi(url, params);
                const response = responses[0];
                const current = response.current()!;
                const utcOffsetSeconds = response.utcOffsetSeconds();
                const weatherData = {
                    time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                    temperature2m: current.variables(0)!.value(),
                    relativeHumidity2m: current.variables(1)!.value(),
                    isDay: current.variables(2)!.value(),
                    precipitation: current.variables(3)!.value(),
                    weatherCode: current.variables(4)!.value(),
                    windSpeed10m: current.variables(5)!.value(),
                    windDirection10m: current.variables(6)!.value(),
                };
                
                const embed = new EmbedBuilder()
                    .setTitle(`Weather for ${user.displayName} at ${new Date().toUTCString()}`)
                    .setDescription(weatherCodes[weatherData.weatherCode].day.description)
                    .addFields(
                        {
                            name: 'Temperature',
                            value: `${Math.round(weatherData.temperature2m)} F`,
                            inline: true
                        },
                        {
                            name: 'Relative Humidity',
                            value: `${Math.round(weatherData.relativeHumidity2m)}`,
                            inline: true
                        },
                        {
                            name: 'Daily Precipitation',
                            value: `${weatherData.precipitation} In`,
                            inline: true
                        },
                        {
                            name: 'Wind Speed',
                            value: `${weatherData.windSpeed10m} MPH`,
                            inline: true
                        },
                        {
                            name: 'Wind Direction',
                            value: `${Math.round(weatherData.windDirection10m)}`,
                            inline: true
                        },
                    )
                    .setThumbnail(weatherCodes[weatherData.weatherCode][weatherData.isDay ? 'day': 'night'].image)
                    .setColor('#0000FF')
                    .setFooter({
                        text: 'Powered By Open-Meteo And OpenStreetMap',
                    });
                interaction.editReply({embeds: [embed]});
                break;
            }

            case 'list': {
                let message = '## Active User List\n';
                for (let i=0;i<Object.keys(userDatabase.getFull()).length;i++){
                    const user = Object.keys(userDatabase.getFull())[i];
                    message += `* ${(await interaction.guild.members.fetch(user)).displayName}\n`;
                }
                await interaction.reply(message);
                break;
            }
            default:
                // interaction.reply('Sorry but as of 5/27/2024 this service has been discontinued.');
                console.log('Something went wrong :(');
        }
    }
};