#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import hashlib
import htpc
import imghdr
import logging
from cherrypy.lib.static import serve_file
from urllib2 import Request, urlopen
import urllib
import time
from functools import wraps
from operator import itemgetter
import itertools
from mako import exceptions
from mako.lookup import TemplateLookup

try:
    import Image
    PIL = True
except ImportError:
    try:
        from PIL import Image
        PIL = True
    except ImportError:
        PIL = False

logger = logging.getLogger('htpc.helpers')


def get_image(url, height=None, width=None, opacity=100, mode=None, auth=None, headers=None):
    ''' Load image form cache if possible, else download. Resize if needed '''
    opacity = float(opacity)
    logger = logging.getLogger('htpc.helpers')

    # Create image directory if it doesnt exist
    imgdir = os.path.join(htpc.DATADIR, 'images/')
    if not os.path.exists(imgdir):
        logger.debug('Creating image directory at ' + imgdir)
        os.makedirs(imgdir)

    # Create a hash of the path to use as filename
    imghash = hashlib.md5(url).hexdigest()

    # Set filename and path
    image = os.path.join(imgdir, imghash)

    # If there is no local copy of the original
    # download it
    if not os.path.isfile(image):
        logger.debug('No local image found for ' + image + '. Downloading')
        image = download_image(url, image, auth, headers)

    # Check if resize is needed
    if (height and width) or (opacity < 100) or mode:

        if PIL:
            # Set a filename for resized file
            resized = '%s_w%s_h%s_o_%s_%s' % (image, width, height, opacity, mode)

            # If there is no local resized copy
            if not os.path.isfile(resized):
                # try to resize, if we cant return original image
                try:
                    image = resize_image(image, height, width, opacity, mode, resized)
                except Exception as e:
                    logger.debug('%s returning orginal image %s' % (e, url))
                    return serve_file(path=image, content_type='image/png')

            # If the resized image is already cached
            if os.path.isfile(resized):
                image = resized

        else:
            logger.error("Can't resize when PIL is missing on system!")
            if (opacity < 100):
                image = os.path.join(htpc.RUNDIR, 'interfaces/default/img/fff_20.png')

    # Load file from disk
    imagetype = imghdr.what(image)
    if imagetype is not None:
        return serve_file(path=image, content_type='image/' + imagetype)


def download_image(url, dest, auth=None, headers=None):
    ''' Download image and save to disk '''
    logger = logging.getLogger('htpc.helpers')
    logger.debug('Downloading image from %s to %s' % (url, dest))

    try:
        request = Request(url)

        if auth:
            request.add_header('Authorization', 'Basic %s' % auth)

        if headers:
            for key, value in headers.iteritems():
                request.add_header(key, value)
            # Sonarrs image api returns 304, but they cant know if a user has cleared it
            # So make sure we get data every time.
            request.add_header('Cache-Control', 'private, max-age=0, no-cache, must-revalidate')

        with open(dest, 'wb') as local_file:
            local_file.write(urlopen(request).read())

        return dest

    except Exception as e:
        logger.error('Failed to download %s to %s %s' % (url, dest, e))


def resize_image(img, height, width, opacity, mode, dest):
    ''' Resize image, set opacity and save to disk '''
    imagetype = imghdr.what(img)
    im = Image.open(img)

    # Only resize if needed
    if height is not None or width is not None:
        size = int(width), int(height)
        im = im.resize(size, Image.ANTIALIAS)

    # Apply overlay if opacity is set
    if (opacity < 100):
        enhance = opacity / 100
        # Create white overlay image
        overlay = Image.new('RGB', size, '#FFFFFF')
        # apply overlay to resized image
        im = Image.blend(overlay, im, enhance)

    # See http://effbot.org/imagingbook/concepts.htm
    # for the different modes
    if mode:
        im = im.convert(str(mode))

    if imagetype.lower() == 'jpeg' or 'jpg':
        im.save(dest, 'JPEG', quality=95)
    else:
        im.save(dest, imagetype)

    return dest


def fix_basepath(s):
    ''' Removes whitespace and adds / on each end '''
    if s:
        s = s.strip()
        s = s.rstrip('/')
        s = s.lstrip('/')
    if not s.startswith('/'):
        s = '/' + s
    if not s.endswith('/'):
        s += '/'
    return s


def striphttp(s):
    # hate regex and this was faster
    if s:
        s = s.strip(' ')
        s = s.replace('https://', '')
        s = s.replace('http://', '')
        return s
    else:
        return ''


def timeit_func(func):
    @wraps(func)
    def inner(*args, **kwargs):
        start = time.time()
        res = func(*args)
        print '%s took %s' % (func.__name__, time.time() - start)
        return res
    return inner


def remove_dict_dupe_from_list(l, key):
    getvals = itemgetter(key)
    l.sort(key=getvals)
    result = []
    for k, g in itertools.groupby(l, getvals):
        result.append(g.next())
    return result


def create_https_certificates(ssl_cert, ssl_key):
    '''
    Create self-signed HTTPS certificares and store in paths 'ssl_cert' and 'ssl_key'
    '''
    try:
        from OpenSSL import crypto
        from certgen import createKeyPair, createCertRequest, createCertificate, TYPE_RSA, serial

    except Exception, e:
        logger.error(e)
        logger.error('You need pyopenssl and OpenSSL to make a cert')
        return False

    # Create the CA Certificate
    cakey = createKeyPair(TYPE_RSA, 2048)
    careq = createCertRequest(cakey, CN='Certificate Authority')
    cacert = createCertificate(careq, (careq, cakey), serial, (0, 60 * 60 * 24 * 365 * 10))  # ten years

    cname = 'Htpc-Manager'
    pkey = createKeyPair(TYPE_RSA, 2048)
    req = createCertRequest(pkey, CN=cname)
    cert = createCertificate(req, (cacert, cakey), serial, (0, 60 * 60 * 24 * 365 * 10))  # ten years

    # Save the key and certificate to disk
    try:
        open(ssl_key, 'w').write(crypto.dump_privatekey(crypto.FILETYPE_PEM, pkey))
        open(ssl_cert, 'w').write(crypto.dump_certificate(crypto.FILETYPE_PEM, cert))
    except Exception as e:
        logger.error('Error creating SSL key and certificate %s' % e)
        return False

    return True


def joinArgs(args):
    ''' stolen for plexapi '''
    if not args:
        return ''
    arglist = []
    for key in sorted(args, key=lambda x: x.lower()):
        value = str(args[key])
        arglist.append('%s=%s' % (key, urllib.quote(value)))
    return '?%s' % '&'.join(arglist)


def sizeof(num):
        for x in ['bytes', 'KB', 'MB', 'GB', 'TB']:
            if num < 1024.0:
                return '%3.2f %s' % (num, x)
            num /= 1024.0
        return '%3.2f %s' % (num, 'TB')


def serve_template(name, **kwargs):
    try:
        loc = os.path.join(htpc.RUNDIR, 'interfaces/',
                           htpc.settings.get('app_template', 'default'))

        template = TemplateLookup(directories=[os.path.join(loc, 'html/')])

        return template.get_template(name).render(**kwargs)

    except Exception as e:
        logger.error('%s' % exceptions.text_error_template())
        if htpc.DEV or htpc.LOGLEVEL == 'debug':
            return exceptions.html_error_template().render()
