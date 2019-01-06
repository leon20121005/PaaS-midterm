const moduleName = "cinemaService"

import * as cinemaModel from "./firestoreModels/cinemaModel"
import * as lineService from "./lineService"

export const showCinemas = async function(replyToken: string): Promise<void>
{
    const cinemas = await cinemaModel.getCinemas()
    const lineMessage = lineService.toCinemasCarousel(cinemas)
    lineService.replyMessage(replyToken, lineMessage)
}
