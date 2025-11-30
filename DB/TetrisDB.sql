﻿USE [master]
GO
CREATE DATABASE [TetrisDB]
GO
USE [TetrisDB]
GO
CREATE TABLE [dbo].[Game](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[GameDate] [datetime] NULL,
	[Score] [nchar](10) NULL,
	[UserID] [int] NOT NULL,
CONSTRAINT [PK_Game] PRIMARY KEY CLUSTERED ([Id] ASC)
)
GO
CREATE TABLE [dbo].[User](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Login] [nvarchar](50) NOT NULL,
	[Password] [nvarchar](50) NOT NULL,
	[RegistrationDate] [datetime] NOT NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([Id] ASC)
)
GO
ALTER TABLE [dbo].[Game]  WITH CHECK ADD CONSTRAINT [FK_Games_UserID] FOREIGN KEY([UserID])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[Game] CHECK CONSTRAINT [FK_Games_UserID]
GO