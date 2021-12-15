import * as mongoose from 'mongoose';
import { ZoomSchema } from '../models/model';
import { Request, Response } from 'express';
const request = require('request');
import { config as configDotenv } from 'dotenv';
import { resolve } from 'path'
configDotenv({
    path: resolve(__dirname, "../../.env")
})


const ZoomAuth = mongoose.model('ZoomAuth', ZoomSchema);
export class ZoomAuthController {

    public checkToken(req: Request, res: Response) {
        try {
            // console.log(process.env.ZOOM_CLIENT_ID + ":" + process.env.ZOOM_CLIENT_SECRETE)
            let token = Buffer.from(process.env.ZOOM_CLIENT_ID + ":" + process.env.ZOOM_CLIENT_SECRETE).toString('base64');

            var options = {
                'method': 'POST',
                'url': 'https://zoom.us/oauth/token',
                'headers': {
                    'Authorization': 'Basic ' + token,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                form: {
                    'grant_type': 'authorization_code',
                    'redirect_uri': process.env.ZOOM_REDIRECT_URL,
                    'code': req.body.code
                }
            };
            request(options, function (error, response) {
                // console.log(error)
                if (error) {
                    return res.json({
                        success: false,
                        data: null,
                        message: "Token not Created"
                    })

                } else {
                    response.body = JSON.parse(response.body);
                    console.log(response.body)
                    if (response.body.access_token) {
                        var options = {
                            'method': 'GET',
                            'url': 'https://api.zoom.us/v2/users/me',
                            'headers': {
                                'Authorization': 'Bearer ' + response.body.access_token,
                            }
                        };
                        request(options, async function (error, responseUser) {
                            if (error) {
                                return res.json({
                                    success: false,
                                    data: null,
                                    message: "Token not Created"
                                })

                            } else {
                                await ZoomAuth.deleteOne({ user_id: req.body.user_id });
                                const zoom_auth = new ZoomAuth({
                                    token: response.body,
                                    user_data: JSON.parse(responseUser.body),
                                    user_id: req.body.user_id
                                });
                                zoom_auth
                                    .save()
                                    .then(data => {

                                        return res.json({
                                            success: true,
                                            data: data,
                                            message: "Token  Created"
                                        })
                                    })
                                    .catch(err => {

                                        return res.json({
                                            success: false,
                                            data: null,
                                            message: "Token not Created"
                                        })
                                    });
                            }
                        })
                    } else {
                        return res.json({
                            success: false,
                            data: null,
                            message: "Token not Created"
                        })
                    }
                }

            });
        } catch (e) {

            return res.json({
                success: false,
                data: null,
                message: "Token not Created"
            })
        }
    };

    public getZoomToken(req: Request, res: Response) {
        try {
            ZoomAuth.find({ user_id: req.body.user_id }, (err, zoomObjects) => {
                // console.log(err, zoomObjects)
                if (zoomObjects.length) {
                    return res.json({
                        success: true,
                        data: zoomObjects[0],
                    })
                } else {
                    return res.json({
                        success: false,
                        data: null,

                    })
                }
            });
        } catch (e) {
            return res.json({
                success: false,
                data: null,
            })
        }
    };


    public deleteZoomToken = async (req: Request, res: Response) => {
        try {
            const zoomObjects = await ZoomAuth
                .find({ user_id: req.body.user_id })
                .limit(1)
            if (zoomObjects.length) {
                let token = Buffer.from(process.env.ZOOM_CLIENT_ID + ":" + process.env.ZOOM_CLIENT_SECRETE).toString('base64');
                var options = {
                    'method': 'POST',
                    'url': 'https://zoom.us/oauth/revoke',
                    'headers': {
                        'Authorization': 'Basic ' + token,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    form: {
                        'token': zoomObjects[0].token[0].access_token,
                    }
                };
                request(options, async function (error, response) {
                    console.log(error, response.body)
                    await ZoomAuth.deleteOne({ user_id: req.body.user_id });
                    return res.json({
                        success: true,
                        data: "Token Delete",
                    })
                });


            } else {
                return res.json({
                    success: false,
                    data: "Token Delete failed.",
                })
            }
        } catch (e) {
            return res.json({
                success: false,
                data: "Token Delete failed.",
            })
        }
    };

    public getZoomMeeting = async (req: Request, res: Response) => {
        try {
            ZoomAuth.find({ user_id: req.body.user_id }, (err, zoomObjects: any) => {
                console.log(err, zoomObjects)
                if (zoomObjects.length) {

                    let user_id = zoomObjects[0].user_data[0]['id'];
                    let tokenBase64 = Buffer.from(process.env.ZOOM_CLIENT_ID + ":" + process.env.ZOOM_CLIENT_SECRETE).toString('base64');
                    var options = {
                        'method': 'POST',
                        'url': 'https://zoom.us/oauth/token',
                        'headers': {
                            'Authorization': 'Basic ' + tokenBase64,
                            'Content-Type': 'application/x-www-form-urlencoded',

                        },
                        form: {
                            'grant_type': 'refresh_token',
                            'refresh_token': zoomObjects[0].token[0]['refresh_token']
                        }
                    };
                    request(options, async function (error, response) {
                        if (error) {
                            return res.json({
                                success: false,
                                data: [],
                            })
                        } else {
                            await ZoomAuth.findByIdAndUpdate(zoomObjects[0].id, { token: JSON.parse(response.body) }, { useFindAndModify: false });
                            response.body = JSON.parse(response.body);
                            var options = {
                                'method': 'GET',
                                'url': 'https://api.zoom.us/v2/users/' + user_id + '/meetings?type=scheduled&page_size=300&page_number=1&next_page_token',
                                'headers': {
                                    'Authorization': 'Bearer ' + response.body.access_token,
                                }
                            };
                            request(options, function (error, response) {
                                if (error) {
                                    return res.json({
                                        success: false,
                                        data: [],
                                    })

                                } else {
                                    return res.json({
                                        success: true,
                                        data: JSON.parse(response.body),
                                    })
                                }
                            });
                        }

                    });
                } else {
                    return res.json({
                        success: false,
                        data: null,

                    })
                }
            });
        } catch (e) {
            return res.json({
                success: false,
                data: [],
            })
        }
    };
    public getZoomRecordings = async (req: Request, res: Response) => {
        try {
            console.log("************", req.body)
            const zoomObjects = await ZoomAuth
                .find({ user_id: req.body.user_id })
                .limit(1)
            // .select({ user_id: req.body.user_id });
            if (zoomObjects.length) {
                let user_id = zoomObjects[0].user_data[0]['id'];
                let tokenBase64 = Buffer.from(process.env.ZOOM_CLIENT_ID + ":" + process.env.ZOOM_CLIENT_SECRETE).toString('base64');
                var options = {
                    'method': 'POST',
                    'url': 'https://zoom.us/oauth/token',
                    'headers': {
                        'Authorization': 'Basic ' + tokenBase64,
                        'Content-Type': 'application/x-www-form-urlencoded',

                    },
                    form: {
                        'grant_type': 'refresh_token',
                        'refresh_token': zoomObjects[0].token[0]['refresh_token']
                    }
                };
                request(options, async function (error, response) {
                    console.log(response.body)
                    if (error) {
                        return res.json({
                            success: false,
                            data: [],
                        })
                    } else {
                        if (JSON.parse(response.body).access_token) {
                            await ZoomAuth.findByIdAndUpdate(zoomObjects[0].id, { token: JSON.parse(response.body) }, { useFindAndModify: false });
                            response.body = JSON.parse(response.body);
                            var options = {
                                'method': 'GET',
                                'url': 'https://api.zoom.us/v2/users/' + user_id + '/recordings?from=' + req.body.start + '&to=' + req.body.end + '&page_size=' + req.body.pageSize + "&next_page_token=" + req.body.next_page_token,
                                'headers': {
                                    'Authorization': 'Bearer ' + response.body.access_token,
                                }
                            };
                            
                            request(options, function (error, response) {
                                console.log(error)
                                if (error) {
                                    return res.json({
                                        success: false,
                                        data: [],
                                    })
    
                                } else {
                                    return res.json({
                                        success: true,
                                        data: JSON.parse(response.body),
                                    })
                                }
                            });
                        }
                        else {
                            return res.json({
                                success: false,
                                data: [],
            
                            })
                        }
                    }

                });
            } else {
                return res.json({
                    success: false,
                    data: [],

                })
            }
        } catch (e) {
            console.log(e)
            return res.json({
                success: false,
                data: null,
            })
        }
    };

}
