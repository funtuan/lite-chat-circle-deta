import mongoose from 'mongoose'
import { mongo } from '../config'

mongoose.connect(mongo.url)