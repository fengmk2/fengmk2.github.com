/*
 * Copyright 2010 Red Hat, Inc.
 *
 * Red Hat licenses this file to you under the Apache License, version 2.0
 * (the "License"); you may not use this file except in compliance with the
 * License.  You may obtain a copy of the License at:
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
package http.socket;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;

import org.apache.log4j.Logger;
import org.jboss.netty.buffer.ChannelBuffer;
import org.jboss.netty.buffer.ChannelBuffers;
import org.jboss.netty.util.CharsetUtil;

/**
 * Generates the demo HTML page which is served at http://localhost:8080/
 * 
 * @author <a href="http://www.jboss.org/netty/">The Netty Project</a>
 * @author <a href="http://gleamynode.net/">Trustin Lee</a>
 * 
 * @version $Rev: 2080 $, $Date: 2010-01-26 18:04:19 +0900 (Tue, 26 Jan 2010) $
 */
public class WebSocketServerIndexPage {
	private static Logger logger = Logger
			.getLogger(WebSocketServerHandler.class);
	//private static String DATA_DIR = "/home/beifeng.xy/data";
	private static String DATA_DIR = "D:/data";

	private static final String NEWLINE = "\r\n";

	public static ChannelBuffer getPut(String webSocketLocation) {
		FileWriter fw = null;
		BufferedWriter bw = null;
		try {
			fw = new FileWriter("netty-put.txt");

			bw = new BufferedWriter(fw, 1024 * 1024);

			bw.write("please input filename");

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		try {
			bw.close();
			fw.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return ChannelBuffers.copiedBuffer(
				"<html><head><title>Web Socket Test2</title></head>" + NEWLINE
						+ "<body>" + NEWLINE + "test http with yiihsia"
						+ "</body>" + NEWLINE + "</html>" + NEWLINE,
				CharsetUtil.US_ASCII);
	}

	public static ChannelBuffer getGet(String file) {

		logger.info("get file: " + file);
		FileInputStream fin = null;
		InputStreamReader fileIn = null;
		BufferedReader br = null;
		StringBuffer sbBuffer = new StringBuffer();
		try {
			fin = new FileInputStream(DATA_DIR + file);
			fileIn = new InputStreamReader(fin, "UTF-8");

			br = new BufferedReader(fileIn);
			String line = null;
			String line2= null;
			while ((line = br.readLine()) != null) {
				line2 = line.replace("", ",");
				sbBuffer.append(line2 + "\n");
			}
		} catch (IOException e) {
			return ChannelBuffers.copiedBuffer("please input filename",
					CharsetUtil.US_ASCII);
		}

		try {
			br.close();
			fileIn.close();
			fin.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return ChannelBuffers.copiedBuffer(sbBuffer.toString(),
				CharsetUtil.UTF_8);
	}
}
