export default `
.-os-skeleton * {
  box-sizing: border-box;
}
.-os-skeleton {
  box-sizing: border-box;
  display: table;
  width: 100%;
  padding: 24px;
}

.-os-skeleton-header {
  display: table-cell;
  padding-right: 16px;
  vertical-align: top
}


.-os-skeleton-content {
  display: table-cell;
  width: 100%;
  vertical-align: top
}

.-os-skeleton-content .-os-skeleton-title {
  width: 100%;
  height: 16px;
  margin-top: 16px;
  background: #f2f2f2
}

.-os-skeleton-content .-os-skeleton-title+.-os-skeleton-paragraph {
  margin-top: 24px
}

.-os-skeleton-content .-os-skeleton-paragraph {
  padding: 0
}

.-os-skeleton-content .-os-skeleton-paragraph>li {
  width: 100%;
  height: 16px;
  list-style: none;
  background: #f2f2f2
}

.-os-skeleton-content .-os-skeleton-paragraph>li:last-child:not(:first-child):not(:nth-child(2)) {
  width: 61%
}

.-os-skeleton-content .-os-skeleton-paragraph>li+li {
  margin-top: 16px
}

.-os-skeleton.-os-skeleton-active .-os-skeleton-content .-os-skeleton-title,.-os-skeleton.-os-skeleton-active .-os-skeleton-content .-os-skeleton-paragraph>li {
  background: -webkit-gradient(linear, left top, right top, color-stop(25%, #f2f2f2), color-stop(37%, #e6e6e6), color-stop(63%, #f2f2f2));
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
  background-size: 400% 100%;
  -webkit-animation: os-skeleton-loading 1.4s ease infinite;
  animation: os-skeleton-loading 1.4s ease infinite
}


@-webkit-keyframes os-skeleton-loading {
  0% {
      background-position: 100% 50%
  }

  100% {
      background-position: 0 50%
  }
}

@keyframes os-skeleton-loading {
  0% {
      background-position: 100% 50%
  }

  100% {
      background-position: 0 50%
  }
}
`