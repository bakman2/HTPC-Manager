var row_n = 0

function loadWantedAlbums () {
    if (!$('#headphones-carousel').length) return
    $.get(WEBDIR + 'headphones/GetWantedList', function (data) {
        if (data == null) {
            dasherror('dash_wanted_albums', 'No data returned from headphones')
            return
        }

        if (data && !data.length) { // not sure if this is correct, dont have hp to test with.
            dasherror('dash_wanted_albums', 'No wanted albums')
            return
        }
        $.each(data, function (i, albums) {
            var src;
            var itemDiv = $('<div>').addClass('item carousel-item')

            if (i === 0) itemDiv.addClass('active')

            var tt;
            if (albums.ReleaseDate != null || album.ReleaseDate != 'None' || typeof(album.ReleaseDate !== 'undefined')){
                // release date should be (yyyy) or empty string
                tt = ' (' + albums.ReleaseDate.substring(0,4) + ') '
            } else {
                    tt = '  '
            }
            if (albums.ArtistName === 'None' || albums.ArtistName == null ) {
                // to remove None..
                albums.ArtistName = ''
            }
            if (albums.ArtworkURL === null) {
                src = WEBDIR + 'img/no-cover-art.png'
            } else {
               src = WEBDIR + 'headphones/GetThumb?h=240&w=430&thumb=' + albums.ArtworkURL
            }

            itemDiv.attr('style', 'background-image: url("' + src + '")')

            itemDiv.append($('<div>').addClass('carousel-caption').click(function() {
                location.href = WEBDIR +'headphones/#wanted'
            }).append(
                $('<h4>').html(albums.AlbumTitle + tt)
            ))
            $('#headphones-carousel .carousel-inner').append(itemDiv)


        })
        $('#headphones-carousel').show()
    })
}

function loadRecentMovies () {
    if (!$('#movie-carousel').length) return
    $.getJSON(WEBDIR + 'kodi/GetRecentMovies',function (data) {
        if (data === null || data.movies === null) return
        $.each(data.movies, function (i, movie) {
            var itemDiv = $('<div>').addClass('item carousel-item')

            if (i === 0) itemDiv.addClass('active')

            var src = WEBDIR + 'kodi/GetThumb?h=240&w=430&thumb='+encodeURIComponent(movie.fanart)
            itemDiv.attr('style', 'background-image: url("' + src + '")')

            itemDiv.append($('<div>').addClass('carousel-caption').click(function() {
                location.href = WEBDIR +'kodi/#movies'
            }).hover(function() {
                var text = $(this).children('p').stop().slideToggle()
            }).append(
                $('<h4>').html(movie.title + ' (' + movie.year + ')'),
                $('<p>').html(
                    '<b>Runtime</b>: ' + parseSec(movie.runtime) + '<br />' +
                    '<b>Genre</b>: ' + movie.genre.join(', ') + '<br />' +
                    movie.plot
                ).hide()
            ))
            $('#movie-carousel .carousel-inner').append(itemDiv)
        })
        $('#movie-carousel').show()
    })
}
function loadRecentTVshows () {
    if (!$('#tvshow-carousel').length) return
    $.getJSON(WEBDIR + 'kodi/GetRecentShows', function (data) {
        if (data === null) return
        $.each(data.episodes, function (i, episode) {
            var itemDiv = $('<div>').addClass('item carousel-item')

            if (i == 0) itemDiv.addClass('active')

	    var imgp;
	    if (episode.thumbnail) {
	    	imgp = episode.thumbnail;
	    } else {
	    	imgp = episode.fanart
	    }

            var src = WEBDIR + "kodi/GetThumb?h=240&w=430&thumb="+encodeURIComponent(imgp)
            itemDiv.attr('style', 'background-image: url("' + src + '")')

            itemDiv.append($('<div>').addClass('carousel-caption').click(function() {
                location.href = 'kodi/#shows'
            }).hover(function() {
                var text = $(this).children('p').stop().slideToggle()
            }).append(
                $('<h4>').html(episode.showtitle + ': ' + episode.label),
                $('<p>').html(
                    '<b>Runtime</b>: ' + parseSec(episode.runtime) + '<br />' + episode.plot
                ).hide()
            ))
            $('#tvshow-carousel .carousel-inner').append(itemDiv)
        })
        $('#tvshow-carousel').show()
    })
}
function loadRecentAlbumsOld () {
    if (!$('#albums-content').length) return
    $.getJSON(WEBDIR + 'kodi/GetRecentAlbums/4', function (data) {
        if (data === null || data.limits.total === 0) return
        $.each(data.albums, function (i, album) {
            var imageSrc = WEBDIR + 'js/libs/holder.js/45x45/text:No cover'
            if (album.thumbnail != '') {
                imageSrc = WEBDIR + 'kodi/GetThumb?h=45&w=45&thumb='+encodeURIComponent(album.thumbnail)
            }

            var label = album.label
            if (album.year != '0') label += ' (' + album.year + ')'

            $('#albums-content').append(
                $('<li>').addClass('media').append(
                    $('<img>').addClass('media-object pull-left img-rounded').attr('src', imageSrc),
                    $('<div>').addClass('media-body').append(
                        $('<h5>').addClass('media-heading').html(label),
                        $('<p>').text(album.artist[0])
                    )
                ).click(function(e) {
                    location.href = 'kodi/#albums'
                })
            )
        })
        Holder.run()
        $('#albums-content').parent().show()
    })
}

function loadRecentAlbums () {
    if (!$('#music-carousel').length) return
    $.getJSON(WEBDIR + 'kodi/GetRecentAlbums/5',function (data) {
        if (data === null || data.limits.total === 0) return
        $.each(data.albums, function (i, album) {
            var itemDiv = $('<div>').addClass('item carousel-item stretchedbg')

            if (i === 0) itemDiv.addClass('active')
            var src = WEBDIR + 'kodi/GetThumb?h=480&w=480&thumb='+encodeURIComponent(album.thumbnail)
            itemDiv.attr('style', 'background-image: url("' + src + '")')

            itemDiv.append($('<div>').addClass('carousel-caption').click(function() {
                location.href = WEBDIR +'kodi/#music'
            }).hover(function() {
                var text = $(this).children('p').stop().slideToggle()
            })

			.append(
                $('<h4>').html(album.label + ' (' + album.year + ')'),
                $('<p>').html(
                    '<b>Artist</b>: ' + album.artist[0] + '<br />'
                ).hide()
            )
			)
            $('#music-carousel .carousel-inner').append(itemDiv)
        })
        $('#music-carousel').show()
    })
}

function loadRecentMoviesPlex () {
    if (!$('#movie-carousel-plex').length) return
    $.getJSON(WEBDIR + 'plex/GetRecentMovies',function (data) {
        if (data === null) return
        $.each(data.movies, function (i, movie) {
            var itemDiv = $('<div>').addClass('item carousel-item')

            if (i === 0) itemDiv.addClass('active')

            var src = WEBDIR + 'plex/GetThumb?h=240&w=430&thumb='+encodeURIComponent(movie.fanart)
            itemDiv.attr('style', 'background-image: url("' + src + '")')

            itemDiv.append($('<div>').addClass('carousel-caption').click(function() {
                location.href = WEBDIR + 'plex/#movies'
            }).hover(function() {
                var text = $(this).children('p').stop().slideToggle()
            }).append(
                $('<h4>').html(movie.title + ' (' + movie.year + ')'),
                $('<p>').html(
                    '<b>Runtime</b>: ' + parseSec(movie.runtime) + '<br />' +
                    '<b>Genre</b>: ' + movie.genre.join(', ') + '<br />' +
                    movie.plot
                ).hide()
            ))
            $('#movie-carousel-plex .carousel-inner').append(itemDiv)
        })
        $('#movie-carousel-plex').show()
    })
}
function loadRecentTVshowsPlex () {
    if (!$('#tvshow-carousel-plex').length) return
    $.getJSON(WEBDIR + 'plex/GetRecentShows', function (data) {
        if (data === null) return
        $.each(data.episodes, function (i, episode) {
            var itemDiv = $('<div>').addClass('item carousel-item')

            if (i == 0) itemDiv.addClass('active')

            var src = WEBDIR + "plex/GetThumb?h=240&w=430&thumb="+encodeURIComponent(episode.fanart)
            itemDiv.attr('style', 'background-image: url("' + src + '")')

            itemDiv.append($('<div>').addClass('carousel-caption').click(function() {
                location.href = 'plex/#shows'
            }).hover(function() {
                var text = $(this).children('p').stop().slideToggle()
            }).append(
                $('<h4>').html(episode.showtitle + ': ' + episode.label),
                $('<p>').html(
                    '<b>Runtime</b>: ' + parseSec(episode.runtime) + '<br />' + episode.plot
                ).hide()
            ))
            $('#tvshow-carousel-plex .carousel-inner').append(itemDiv)
        })
        $('#tvshow-carousel-plex').show()
    })
}
function loadRecentAlbumsPlex () {
    if (!$('#albums-content-plex').length) return
    $.getJSON(WEBDIR + 'plex/GetRecentAlbums', function (data) {
        if (data === null) return
        $.each(data.albums, function (i, album) {
            var imageSrc = WEBDIR + 'js/libs/holder.js/45x45/text:No cover'
            if (album.thumbnail != '') {
                imageSrc = WEBDIR + 'plex/GetThumb?h=45&w=45&thumb='+encodeURIComponent(album.thumbnail)
            }

            var label = album.title
            if (album.year != '0' && typeof album.year !== 'undefined') {
                label += ' (' + album.year + ')'
            }

            $('#albums-content-plex').append(
                $('<li>').addClass('media').append(
                    $('<img>').addClass('media-object pull-left img-rounded').attr('src', imageSrc),
                    $('<div>').addClass('media-body').append(
                        $('<h5>').addClass('media-heading').html(label),
                        $('<p>').text(album.artist)
                    )
                ).click(function(e) {
                    location.href = 'plex/#albums'
                })
            )
        })
        Holder.run()
        $('#albums-content-plex').parent().show()
    })
}
function loadDownloadHistory() {
    if (!$('#downloads_table_body').length) return
    $.getJSON(WEBDIR + 'sabnzbd/GetHistory?limit=5', function (data) {
        $.each(data.history.slots, function (i, slot) {
            var status = $('<i>').addClass('fa fa-check')
            if (slot.status == 'Failed') {
                status.removeClass().addClass('fa fa-times').attr('title', slot.fail_message)
            }
            $('#downloads_table_body').append(
                $('<tr>').append(
                    $('<td>').html(slot.name).attr('title', slot.name),
                    $('<td>').html(status)
                )
            )
        })
    })
}
function loadNZBGetDownloadHistory() {
    if (!$('#nzbgetdownloads_table_body').length) return;
    $.getJSON(WEBDIR + 'nzbget/GetHistory', function (data) {
        if (!data.length) {
            $('#nzbgetdownloads_table_body').append(
            $('<tr>').append($('<td>').html('History is empty')));
            return;
        }
        $.each(data, function (i, slot) {
            var status = $('<i>').addClass('fa fa-check');
            if (slot.ParStatus == 'FAILURE') {
                status.removeClass().addClass('fa fa-times').attr('title', slot.fail_message);
            }
            // Limit the results to 5
            if (i >= 5) return;
            $('#nzbgetdownloads_table_body').append(
            $('<tr>').append(
            $('<td>').html(slot.Name).attr('title', slot.Name),
            $('<td>').html(status)));
        });
    });
}
function loadWantedMovies() {
    if (!$('#wantedmovies_table_body').length) return
    $.getJSON(WEBDIR + 'couchpotato/GetMovieList/active/5', function (result) {
        if (result.movies[0] == null) {
            $('#wantedmovies_table_body').append(
                $('<tr>').append($('<td>').html('No wanted movies found').attr('colspan', '2')),
                $('<tr>').append($('<td>').html('&nbsp;').attr('colspan', '2')),
                $('<tr>').append($('<td>').html('&nbsp;').attr('colspan', '2')),
                $('<tr>').append($('<td>').html('&nbsp;').attr('colspan', '2')),
                $('<tr>').append($('<td>').html('&nbsp;').attr('colspan', '2'))
            )
            return
        }
        $.each(result.movies, function(i, item) {
            $('#wantedmovies_table_body').append(
                $('<tr>').append(
                    $('<td>').html(item.info.original_title),
                    $('<td>').addClass('alignright').html(item.info.year)
                )
            )
        })
    })
}
function loadNextAired(options) {
    if (!$('#nextaired_sickbeard_table_body').length) return
    $.getJSON(WEBDIR + 'sickbeard/GetNextAired', function (result) {
        if (result === null || result.data.soon.length === 0) {
            $('#nextaired_sickbeard_table_body').append(
                $('<tr>').append($('<td>').html('No future episodes found')),
                $('<tr>').append($('<td>').html('&nbsp;')),
                $('<tr>').append($('<td>').html('&nbsp;')),
                $('<tr>').append($('<td>').html('&nbsp;')),
                $('<tr>').append($('<td>').html('&nbsp;'))
            )
            return
        }
        var soonaired = result.data.soon
        var todayaired = result.data.today
        var nextaired = todayaired.concat(soonaired)
        $.each(nextaired, function (i, tvshow) {
            if (i >= 5) return
            var name = $('<a>').attr('href', 'sickbeard/view/' + tvshow.tvdbid).html(tvshow.show_name)
            $('#nextaired_sickbeard_table_body').append(
                $('<tr>').append(
                    $('<td>').append(name),
                    $('<td>').html(tvshow.ep_name),
                    $('<td>').html(tvshow.airdate)
                )
            )
        })
    })
}

function loadsonarrCalendar(options) {
    if (!$('#calendar_table_body').length) return
    $.getJSON(WEBDIR + 'sonarr/Calendar', function (result) {
        $.each(result, function (i, cal) {
          if (i >= 5) return
            var name = $('<a>').attr('href', 'sonarr/View/' + cal.seriesId + '/' + cal.series.tvdbId + '#' + cal.seasonNumber).html(cal.series.title)
            var number
            var row = $('<tr>')
            var img = makeIcon('fa fa-info-circle', cal.overview);
            row.append(
            $('<td>').append(name),
            $('<td>').html('S' + pad(cal.seasonNumber, 2) + 'E' + pad(cal.episodeNumber, 2) + '&nbsp').append(img),
            $('<td>').text(moment(cal.airDateUtc).fromNow())
            )

            $('#calendar_table_body').append(row);
        });

    });
}

function loadNextAiredSickrage(options) {
    if (!$('#nextaired_sickrage_table_body').length) return
    $.getJSON(WEBDIR + 'sickrage/GetNextAired', function (result) {
        if (result === null) {
            $('#nextairedsickrage_table_body').append(
                $('<tr>').append($('<td>').html('No connection with sickrage')),
                $('<tr>').append($('<td>').html('&nbsp;')),
                $('<tr>').append($('<td>').html('&nbsp;')),
                $('<tr>').append($('<td>').html('&nbsp;')),
                $('<tr>').append($('<td>').html('&nbsp;'))
            )
            return false
        };
        if (result.data.soon.length === 0 && result.data.later.length === 0 && result.data.today.length === 0 && result.data.missed.length === 0) {
            $('#nextairedsickrage_table_body').append(
                $('<tr>').append($('<td>').html('No future/missing episodes found')),
                $('<tr>').append($('<td>').html('&nbsp;')),
                $('<tr>').append($('<td>').html('&nbsp;')),
                $('<tr>').append($('<td>').html('&nbsp;')),
                $('<tr>').append($('<td>').html('&nbsp;'))
            )
            return false
        }
        var missed = result.data.missed;
        var all = missed.concat(result.data.today, result.data.soon, result.data.later)
        $.each(all, function(i, tvshow) {
            if ($('table #nextaired_sickrage_table_body >tr').length >= 5) return false;
            var name = $('<a>').attr('href', 'sickrage/view/' + tvshow.tvdbid).html(tvshow.show_name)
            $('#nextaired_sickrage_table_body').append(
                $('<tr>').append(
                    $('<td>').append(name),
                    $('<td>').html(tvshow.ep_name),
                    $('<td>').html(tvshow.airdate)
                )
            )

        })
    })
}

function dasherror(i, msg){
    // expects id like #dash_wanted_albums
    var h = $('#' + i).find('h3')
    $('#' + i).html('')
    var t = "<table class='table table-striped'><tr><td>"+ msg + "</td></tr><tr><td>&nbsp;</td></tr><tr><td>&nbsp;</td></tr><tr><td>&nbsp;</td></tr><tr><td>&nbsp;</td></tr></table>"
    $('#' + i).append(h, t)

}


function loadsysinfo(options) {
    start_refresh('sysinfo','loadsysinfo');
    $.getJSON(WEBDIR + 'stats/sysinfodash', function(result) {
        $('#dash_sysinfo_table_body').append(
            $('<tr>').append(
                $('<td>').html('CPU'),
                $('<td>').addClass('span4').html("<div class=progress><div class=bar style=width:" + result.cpu.user.toFixed(1) + "%><span class=sr-only>User: "+ result.cpu.user.toFixed(1) +"%</span></div><div class='bar bar-warning' style=width:" + result.cpu.system.toFixed(1) + "%><span class=sr-only>System: "+ result.cpu.system.toFixed(1) +"%</span></div><div class='bar bar-success' style=width:" + (100 - (result.cpu.user + result.cpu.system)).toFixed(1) + "%><span class=sr-only>Idle: " + result.cpu.idle.toFixed(1) +"%</span></div></div>")
            ),
            $('<tr>').append(
                $('<td>').html('MEM'),
                $('<td>').addClass('span4').html("<div class=progress><div class=bar style=width:" + result.virtual.percent + "%><span class=sr-only>Used: "+ getReadableFileSizeString((result.virtual.total - result.virtual.available))+"</span></div><div class='bar bar-success' style=width:" + (100 - result.virtual.percent) + "% ><span class=sr-only>Free: " + getReadableFileSizeString(result.virtual.available) +"</span></div>")
            ),

            $('<tr>').append(
                $('<td>').text('IP'),
                $('<td>').append(
                    $('<div>').append(
                        $('<div class="pull-left">').html(result.localip),
                        $('<div class="pull-right">').html(result.externalip)
                    )
                )
            ),

            $('<tr>').append(
                $('<td>').text('Network'),
                $('<td>').append(
                    $('<div>').append(
                        $('<div class="pull-left">').html('<i class="fa fa-arrow-down"></i> ' + getReadableFileSizeString(result.network.bytes_recv)),
                        $('<div class="pull-right">').html('<i class="fa fa-arrow-up"></i> ' + getReadableFileSizeString(result.network.bytes_sent))
                    )
                )
            )

            // add one more with current user and login?
        )

    }).always(function() {
        end_refresh('sysinfo');
    });
}

function loaddiskinfo() {
    start_refresh('disks','loaddiskinfo')
    $.ajax({
        'url': WEBDIR + 'stats/disk_usage',
        'dataType': 'json' ,
        'complete': function () { end_refresh('disks') },
        'success': function (response) {
            $.each(response, function (i, disk) {
                var row = $('<tr>');
                var progress = "<div class='progress' style=margin-bottom:0px><div class=bar style=width:" + disk.percent + "%><span class=sr-only>"+ getReadableFileSizeStringHDD(disk.used) +"</span></div><div class='bar bar-success' style=width:" + (100 - disk.percent) + "% ><span class=sr-only>" + getReadableFileSizeStringHDD(disk.free) +"</span></div>";
                row.append(
                $('<td>').addClass('stats_disk_mountpoint').text(disk.mountpoint),
                $('<td>').addClass('stats_disk_progress span4').html(progress),
                $('<td>').addClass('stats_disk_percent').text(disk.percent + '%'));
                $('#dash_disks_table_body').append(row);
            });
        }
    })
}

function loadsmartinfo() {
    start_refresh('smart','loadsmartinfo')
    $.ajax({
        'url': WEBDIR + 'stats/smart_info',
            'dataType': 'json' ,
            'complete': function () { end_refresh('smart') },
            'success': function (response) {
            if (response == null || response.length == 0 || jQuery.isEmptyObject(response)) {
                    var row = $('<tr>');
                    row.append($('<td>').text("S.M.A.R.T not correctly configured."));
                    $('#dash_smart_table_body').append(row);
            } else {
                byteSizeOrdering()
                $.each(response, function (i, drives) {
                    var row = $('<tr>');
                    row.append(
                    $('<td>').text(drives.name),
                    $('<td>').addClass('span4').text(drives.model),
                    $('<td>').text(drives.temperature + String.fromCharCode(176)),
                    $('<td>').text(drives.assessment));
                    $('#dash_smart_table_body').append(row);
                });
            }
        }
    });
}


// For hdd. Converts bytes to filesize in kb,mb,gb
 function getReadableFileSizeStringHDD(fileSizeInBytes) {
    var i = -1;
    var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB'];
    do {
        fileSizeInBytes = fileSizeInBytes / 1000;
        i++;
    } while (fileSizeInBytes > 1000);
    return fileSizeInBytes.toFixed(1) + byteUnits[i];
};

//
function bytestospeed(bytes) {
    var i = -1;
    var byteUnits = [' Kb', ' Mb', ' Gb', ' Tb', ' Pb'];
    do {
        bytes = bytes / 1024;
        i++;
    } while (bytes > 1024);
    return bytes.toFixed(2) + byteUnits[i]+ '\\s';
}

function loadqbit() {
    start_refresh('qbit','loadqbit')
    $.ajax({
        'url': WEBDIR + 'qbittorrent/fetch',
        'dataType': 'json',
        'complete': function () { end_refresh('qbit') },
        'success': function (response) {
            var numberofloop = 0;
            var downloads = {};
            var i = 0;
            $.each(response, function (index, torrent) {
                if (torrent.state != "uploading"){
                    downloads[i] = torrent;
                    i = i + 1;
                }
            });
            if (i > 0) {
                var max = i;
                if (i > 5) { var max = 4; }
                $.each(downloads, function (index, torrent) {
                    tr = $('<tr>');
                    numberofloop += 1;
                    if (numberofloop <= max) {
                        tr.append(
                        $('<td>').addClass('span5 qbt_name').html(torrent.name),
                        $('<td>').addClass('qbit_eta alignright').text(torrent.eta));
                        $('#dash_qbit_table_body').append(tr);
                    } else {
                        tr.append($('<td>').addClass('span6 aligncenter').attr("colspan",2).html("<small>" + (i - max) + " more torrents</small>"))
                        $('#dash_qbit_table_body').append(tr);
                        return false;
                    }
                });
            } else {
                tr = $('<tr>');
                tr.append($('<td>').addClass('span6 aligncenter').attr("colspan",2).html("<small>No active downloads</small>"))
                $('#dash_qbit_table_body').append(tr);
            }
        }
    });
}

function start_refresh(module, fn){
    if ($('#dash_'+module).children('h3:first-child').has('.refresh-btns').length == 0){
        $('#dash_'+module).children('h3:first-child').append('<span class="refresh-btns">' +
                                '<i id="'+module+'-refresh"  style="font-size:0.6em" class="btn fa fa-refresh" title="Refresh" onclick="'+fn+'();"></i>' +
                                '<i class="fa fa-spinner fa-pulse" style="font-size:0.7em" id="'+module+'-spinner"></i></span>');
    }
    $('#'+module+'-refresh').hide();
    $('#dash_'+module+'_table_body').html("");
    $('#'+module+'-spinner').show();
}

function end_refresh(module){
    $('#'+module+'-refresh').show();
    $('#'+module+'-spinner').hide();
}

function enable_module (module, dest, fn){
    jQuery("#" + module).detach().appendTo("#" + dest);
    if (fn in window) {
        window[fn]();
    }
}

function new_row(){
    row_n++;
    var newrow = $('<div>').addClass('row-fluid dash-row').attr('id', 'dash-row-' + row_n);
    $("#dash-content").append(newrow);
}

function enable_sortable() {
   $(".dash-row").sortable({
        connectWith: '.dash-row',
        helper: "clone",
        //receive: This event is triggered when a
        //connected sortable list has received an item from another list.
        receive: function(event, ui) {
            // so if > 3
            if ($(this).children().length > 3) {
                $(ui.sender).sortable('cancel');
            }
        }

    }).disableSelection();
}

$('.dash-edit').click(function() {
    $("#editButtons").show();
    $(".dash-row").addClass("dash-row-edit");
    $(".dash-module").addClass("dash-module-edit");
    enable_sortable()
});

$('#dash-addRow').click(function() {
    row_n++;
    var newrow = $('<div>').addClass('row-fluid dash-row dash-row-edit').attr('id', 'dash-row-' + row_n);
    $("#dash-content").append(newrow);
    enable_sortable()
});

$('#dash-cancel').click(function() {
    location.href=WEBDIR;
});

$('#dash-save').click(function() {
    $("#editButtons").hide();
    $(".dash-row").removeClass('dash-row-edit')
    $(".dash-module").removeClass("dash-module-edit");
    $(".dash-row").sortable('disable');
    $('.dash-row:empty').remove();
    window.location.hash = '#';
    var sorted = "";
    $(".dash-row").each(function(index) {
        sorted += $(this).sortable("toArray") + ";";
    });
    $.get(WEBDIR + "save_dash", 'dash_order=' + encodeURIComponent(sorted), function (data) {
          notify('Dashboard',data,'info');
    })
    $(".dash-row").sortable('destroy');
});

$(document).ready(function () {
    if (Object.keys(modules).length == 0) {
        jQuery("#notConfigured").detach().appendTo("#dash-content"); //display setup msg if no modules enabled
    } else {
        var modules_per_row = 0;
        if (dash_order != '0' && dash_order != 'False') { // create modules if dash_order is set
            rows_to_build = dash_order.split(";");
            for (i = 0; i < rows_to_build.length; i++) { //loop rows
                new_row();
                modules_per_row = 0;
                modules_to_build = rows_to_build[i].split(',')
                for (x = 0; x < modules_to_build.length; x++) { //loop modules
                    if (modules_to_build[x] in modules){
                        enable_module(modules_to_build[x], "dash-row-" + row_n, modules[modules_to_build[x]])
                        delete modules[modules_to_build[x]]; //delete module from modules object so it will not be re-created on next loop
                        modules_per_row++;
                    }
                }
            }
        }
        for (module in modules) {  // create aditional modules not in dash_order
                if (modules_per_row == 0) {
                    new_row();
                }
                modules_per_row++;
                enable_module(module, "dash-row-" + row_n, modules[module])
                if (modules_per_row > 2) {
                    modules_per_row = 0;
                }
        }
        $('.dash-row:empty').remove();
        jQuery("#editButtons").detach().prependTo("#dash-content"); //show edit buttons

        if (window.location.hash.indexOf('edit') == 1) {
            $('.dash-edit').click();
        }
    }
})
