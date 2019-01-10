import * as functions from "firebase-functions"
import * as firebaseAdmin from "firebase-admin"
firebaseAdmin.initializeApp(functions.config().firebase)
firebaseAdmin.firestore().settings({ timestampsInSnapshots: true })

import * as lineWebhook from "./lineWebhook"
import * as notificationService from "./notificationService"
export const chatbotWebhook = lineWebhook.chatbotWebhook
export const reportAttendance = notificationService.reportAttendance
export const notifyReservation = notificationService.notifyReservation

import * as reservationService from "./reservationService"
export const httpReserveTickets = reservationService.httpReserveTickets
