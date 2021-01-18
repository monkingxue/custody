# -*- coding: utf-8 -*-
import  logging

FORMAT = "[%(asctime)s:%(filename)s:%(lineno)s:%(funcName)s] %(message)s"
logging.basicConfig(format=FORMAT, level=logging.INFO)
logger = logging.getLogger()
